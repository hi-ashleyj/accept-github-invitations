# Accept GitHub Invitations

This is a basic utility that can automatically accept repo invitations for github.

### Requirements
Node.js, tested on 14.x but should be fine on most modern versions

A Personal Access Token with repo:invite permissions. Get one at Github > Settings > Developer Settings > Personal Access Tokens and be sure to select repo:invite scopes before generation

### Usage
1. Clone the repo
```bash
git clone https://github.com/hi-ashleyj/accept-github-invitations.git
```
2. Create a config.json file in the root directory and add a Personal Access Token with repo:invite scope
```json
{
    "access_token": "<YOUR_TOKEN_HERE>"
}
```
3. Run with
```bash
node app.js
# or
npm start
```
or, if you want to pass in your access token instead, use
```bash
node app.js --token <YOUR_TOKEN_HERE>
```

### Using the action
1. Create your own copy of the repo (however you like to do this)
2. Add a secret (Repo Settings > Secrets) called INVITE_ACCESS_TOKEN with your access token
3. Execute the workflow run from the actions tab.

## License
Feel free to use this basic script however you like, and modify it to add always-running or at-time based refreshing. I accept PRs and Issues on the base script, not on any modified versions.
