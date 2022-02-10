import * as core from "@actions/core"
import * as github from "@actions/github"
import { isKBIssue, getAction} from "./utils"

try{

    const issue_id = core.getInput("issue-id");
    const token = core.getInput("github-token")
    
    const repos = github.context.repo // context repo

    const client = github.getOctokit(token)
    const resp = await client.rest.issues.get({issue_number: Number(issue_id ), owner: repos.owner, repo:repos.repo})

    const title = resp.data.title
    if(isKBIssue(title)){

        const action_name: String = getAction(title)
        const action_name_split = action_name.split("/")

        const target_owner = action_name_split[0]
        const target_repo = action_name_split[1]

        const action_data = await client.rest.repos.getContent({owner: target_owner, repo: target_repo,path: "/action.yml"})

        // printing base64 encoded content.
        const content = action_data.data["content"]
        core.info(content)


    }else{
        core.info("Issue is not a valid KB issue")
    }
  

}catch(err){
    core.setFailed(err)
}