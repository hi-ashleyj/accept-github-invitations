# Accept GitHub Invitations

This is a basic utility that can automatically accept repo invitations for github.

### Requirements
Node.js, tested on 14.x but should be fine on most modern versions

### Usage
1. Clone the repo
```bash
git clone https://github.com/hi-ashleyj/accept-github-invitations.git
```
2. Add your access token from github to config.json
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

## License
Feel free to use this basic script however you like, and modify it to add always-running or at-time based refreshing. I accept PRs and Issues on the base script, not on any modified versions.