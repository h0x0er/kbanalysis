const core =  require("@actions/core")
const github = require("@actions/github")


try{

    const issue_id = core.getInput("issue-id");
    const token = core.getInput("github-token");

    core.info(`issue: ${issue_id}`)
    core.info(`token: ${token}`)

    const client = github.getOctokit(token);
    const repo = github.context.repo;
    
    const resp = client.rest.issues.get({
        owner: repo.owner, 
        repo: repo.repo,
        issue_number: issue_id
    })

    core.info(resp)

}catch(error){
    core.setFailed(error.message)
}