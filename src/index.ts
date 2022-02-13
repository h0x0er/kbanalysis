import * as core from "@actions/core"
import * as github from "@actions/github"
import { isKBIssue, getAction, getActionYaml, findToken, printArray} from "./utils"

try{

    const issue_id = core.getInput("issue-id");
    const token = core.getInput("github-token")
    
    const repos = github.context.repo // context repo

    const client = github.getOctokit(token) // authenticated octokit
    const resp = await client.rest.issues.get({issue_number: Number(issue_id ), owner: repos.owner, repo:repos.repo})

    const title = resp.data.title // extracting title of the issue.

    if(isKBIssue(title)){
        core.info("===== Performing analysis =====")
        const action_name: String = getAction(title) // target action
        const action_name_split = action_name.split("/") 
        const target_owner = action_name_split[0]
        const target_repo = action_name_split[1]


        const langs = await client.rest.repos.listLanguages({owner:target_owner, repo:target_repo})
        const lang = Object.keys(langs.data)[0] // top language used in repo
        
        core.info(`Issue Title: ${title}`)
        core.info(`Action: ${action_name}`) 
        // core.info(`Token: ${token}`) // TODO: remove after testing
        core.info(`Top language: ${lang}`)

        try{
            const action_data = await getActionYaml(client, target_owner, target_repo)
            const matches = await findToken(action_data)

            let paths_found = []

            for(let match of matches){
                const query = `${match}+in:file+repo:${target_owner}/${target_repo}+language:${lang}`
                const res = await client.rest.search.code({q: query})
                const items = res.data.items.map(item=>item.url)
                paths_found.push(...items)
            }

            await client.rest.issues.createComment({
                ...repos,
                issue_number: Number(issue_id),
                body: `#### Analysis of ${action_name}\n${paths_found.join("\n")}`
            })

            printArray(paths_found, "Paths Found: ")

        }catch(err){
            core.setFailed(err)
        }



    }else{
        core.info("Issue is not a valid KB issue")
    }
  

}catch(err){
    core.setFailed(err)
}