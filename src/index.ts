import * as core from "@actions/core"
import * as github from "@actions/github"
import { isKBIssue, getAction, getActionYaml, findToken, printArray, comment} from "./utils"

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
        core.info(`Top language: ${lang}`)

        try{
            const action_data = await getActionYaml(client, target_owner, target_repo)
            const matches = await findToken(action_data)
            if(matches === null){
                // no github_token pattern found in action file
                core.warning("action.yml doesn't contains reference to github_token")
                await comment(client, repos, Number(issue_id), "This action's `action.yml` doesn't contains any reference to GITHUB_TOKEN")
            }else{
                core.info("Pattern Matches: "+matches.join(","))
                let paths_found = []
                for(let match of matches){
                    const query = `${match}+in:file+repo:${target_owner}/${target_repo}+language:${lang}`
                    const res = await client.rest.search.code({q: query})
                    const items = res.data.items.map(item=>item.html_url)
                    paths_found.push(...items)
                }
                
                const filtered_paths = paths_found.filter((value, index, self)=>self.indexOf(value)===index)

                const body = `
                #### Analysis of ${action_name}
                GITHUB_TOKEN is used in this action.
                ### For figuring usage of GITHUB_TOKEN follow below links.
                ${filtered_paths.join("\n")}
                `

                await comment(client, repos, Number(issue_id), body)
                printArray(filtered_paths, "Paths Found: ")
            }

        }catch(err){
            core.setFailed(err)
        }
    }else{
        core.info("Not performing analysis as issue is not a valid KB issue")
    }
  

}catch(err){
    core.setFailed(err)
}