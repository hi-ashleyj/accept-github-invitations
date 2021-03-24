let uti = require("./util.js");
let fs = require("fs").promises;
let path = require("path");



let doGitHubAccept = async function() {
    // Retrieve the Personal Access Token from config.json
    let access_token = "";
    try {
        access_token = JSON.parse(await fs.readFile(path.resolve(__dirname, "config.json"), { encoding: 'utf8' })).access_token;
    } catch (_err) {
        console.log("Error getting your access token: please check that config.json exists and is valid JSON");
        return;
    }
    
    if (access_token.length < 1) {
        console.log("You need to add an access token to config.json");
        return;
    }

    // Create the headers used to send requests to the API
    let headers = { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + access_token, "User-Agent": "node-v" + process.version + "-accept-github-invitations" };
    console.log("Got access token and built headers");

    // Global definition for loop persistence
    let lastRequestHits = 0;
    
    do {
        let results = [];
        
        try {
            // Attempt to get list of all invitations and parse the response as JSON
            results = JSON.parse(await uti.hGet("https://api.github.com/user/repository_invitations", headers));
        } catch (_err) {
            console.log("Error getting a batch of invitations");
        }

        // set for reference later
        lastRequestHits = results.length;
        console.log("Got batch of " + lastRequestHits + " request" + ((lastRequestHits == 1) ? "": "s") + " to accept");

        for (let res of results) {
            let invitationID = res.id;

            // Send PATCH request to accept invitation
            try {
                await uti.hPatch("https://api.github.com/user/repository_invitations/" + invitationID, headers);
                console.log("Accepted invite #" + invitationID);
            } catch (_err) {
                console.log("Error accepting invite #" + invitationID);
            }
            
        }

        console.log("Batch complete.")

        // If this request's results were zero, then there no more invitations
    } while (lastRequestHits > 0)

    console.log("Finished job");
};

// Do at runtime, or build a thing here to have this always running, and execute at set times
doGitHubAccept();