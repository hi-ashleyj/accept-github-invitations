let uti = require("./util.js");
let fs = require("fs").promises;
let path = require("path");

let passed_token = null;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] == "--token") {
        if (process.argv[i + 1]) {
            passed_token = process.argv[i + 1];
        }
    }
}

let doGitHubAccept = async function() {
    // Retrieve the Personal Access Token from config.json
    let access_token = "";
    let strictMode = false;
    let allowList = [];
    let denyList = [];
    if (passed_token) {
        access_token = passed_token;
    } 

    // Try to load the config info
    try {
        config = JSON.parse(await fs.readFile(path.resolve(__dirname, "config.json"), { encoding: 'utf8' }));

        // Load access token from file if no single-use one was specified
        if (config.access_token && access_token.length <= 0) {
            access_token = config.access_token;
        }

        // Allow "strict mode" (only people added to a list are added)
        if (config.strict) {
            strictMode = true;
        }

        // Load in allowed users
        if (config.allow) {
            if (config.allow instanceof Array) { // Allow for this to load in from file/folder in future. This should be an array
                allowList = config.allow;
            }
        }

        // Load in denied users
        if (config.deny) {
            if (config.deny instanceof Array) { // Allow for this to load in from file/folder in future. This should be an array
                denyList = config.deny;
            }
        }
    } catch (_err) {
        // If there is no access token at all
        if (access_token.length <= 0) {
            console.log("Error getting your access token: please check that config.json exists and is valid JSON");
            return;
        }
        // else fail read silently
    }
    
    if (access_token.length < 1) {
        console.log("You need to add an access token to config.json, or pass one in using --token");
        return;
    }

    // Create the headers used to send requests to the API
    let headers = { "Accept": "application/vnd.github.v3+json", "Authorization": "token " + access_token, "User-Agent": "node-v" + process.version + "-accept-github-invitations" };
    console.log("Got access token and built headers");

    // Global definition for loop persistence
    let lastRequestHits = 0;

    // And then ready up for non-changes
    let lastResponse = "";
    
    do {
        let results = [];
        
        try {
            // Attempt to get list of all invitations and parse the response as JSON
            let unJSON = await uti.hGet("https://api.github.com/user/repository_invitations", headers);
            if (lastResponse == unJSON) {
                console.log("Response unchanged. Breaking loop.");
                break;
            }
            lastResponse = unJSON;
            results = JSON.parse(unJSON);
        } catch (_err) {
            console.log("Error getting a batch of invitations");
            lastRequestHits = 0;
        }

        // set for reference later
        lastRequestHits = results.length;
        console.log("Got batch of " + lastRequestHits + " request" + ((lastRequestHits == 1) ? "": "s") + " to accept");

        for (let res of results) {
            let verdict = !strictMode;
            let invitationID = res.id;

            // Pull response data
            let owner = res.repository.owner.login;
            let inviter = res.inviter.login;

            // Accept people on the allowlist (in case of strict mode)
            if (allowList.includes(owner) || allowList.includes(inviter)) {
                verdict = true;
            }

            // ALWAYS deny owner/inviters that are on the denylist, regardless of allowlist
            if (denyList.includes(owner) || denyList.includes(inviter)) {
                verdict = false;
            };

            if (verdict) {
                // Send PATCH request to accept invitation
                try {
                    await uti.hPatch("https://api.github.com/user/repository_invitations/" + invitationID, headers);
                    console.log("Accepted invite #" + invitationID);
                } catch (_err) {
                    console.log("Error accepting invite #" + invitationID);
                }
            } else {
                // Send DELETE request to deny invitation
                try {
                    await uti.hDelete("https://api.github.com/user/repository_invitations/" + invitationID, headers);
                    console.log("Denied invite #" + invitationID);
                } catch (_err) {
                    console.log("Error denying invite #" + invitationID);
                }
            }
        }

        console.log("Batch complete.")

        // If this request's results were zero, then there no more invitations
    } while (lastRequestHits > 0)

    console.log("Finished job");
};

// Do at runtime, or build a thing here to have this always running, and execute at set times
doGitHubAccept();