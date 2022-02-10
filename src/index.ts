import * as core from "@actions/core"
import * as github from "@actions/github"


try{

    const issue_id = core.getInput("issue-id");
    const token = core.getInput("github-token")
    const repos = github.context.repo
    const client = github.getOctokit(token)
    const resp = await client.rest.issues.get({issue_number: Number(issue_id ), owner: repos.owner, repo:repos.repo})

    core.info(`${resp}`)


}catch(err){
    core.setFailed(err)
}