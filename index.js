const core =  require("@actions/core")
const github = require("@actions/github")

try{

    const issue_id = core.getInput("issue-id");
    const token = core.getInput("github-token");


    const client = github.getOctokit(token);
    const repo = github.context.repo;
    client.rest.issues.get({
        owner: repo.owner, 
        repo: repo.repo,
        issue_number: issue_id
    }).then((resp)=>{
        core.info(`Issue title: ${resp.title}`)
    }).catch((err)=>{
        core.warning(err.message)
    })


}catch(error){
    core.setFailed(error.message)
}