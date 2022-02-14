import {info} from "@actions/core"

export function isKBIssue(title:String){
    const prefix = "[KB] Add KB for" // pattern to check, for KB issue
    const index = title.indexOf(prefix) 
    return index === 0 // for valid KB issue; index of prefix is always 0

}

export function getAction(title:String){
    const splits = title.split(" ")
    const name = splits.pop()
    return name !== undefined ? name !== "" ? name : "not_present" : "not_present"
}

export function validateAction(client, action:String){
    // Function that will verify the existence of action
}

async function getFile(client:any, owner:String, repo:String, path:String){

    const action_data =  await client.rest.repos.getContent({owner: owner, repo: repo,path: path})
    const encoded_content = action_data.data["content"].split("\n")
    const content = encoded_content.join("")
    return Buffer.from(content, "base64").toString() // b64 decoding before returning

}

function normalizeRepo(repo:String){
    let true_repo:String = ""
    let path:String = ""
    if(repo.indexOf("/") > 0){
        // nested repo.
        const repo_split = repo.split("/")
        true_repo = repo_split[0] // first part is true_name of repo
        path = repo_split.slice(1,).join("/")
    }else{
        true_repo = repo
    }

    return {repo:true_repo, path:path}
}

export async function getActionYaml(client: any, owner: String, repo: String){
    
    const norm = normalizeRepo(repo)
    const action_data =  await getFile(client,owner, norm.repo,norm.path+"/action.yml")
    return action_data

}

export async function getReadme(client:any, owner:String, repo:String){
    const norm = normalizeRepo(repo)
    const readme =  await getFile(client,owner, norm.repo,norm.path+"/README.md")
    return readme
}

export function getRunsON(content: String){
    const usingIndex = content.indexOf("using:")
    const usingString = content.substring(usingIndex+6, usingIndex+6+10)
    return usingString.indexOf("node") > -1 ? "Node" : usingString.indexOf("docker") > -1 ? "Docker" : "Composite"
}

export async function findToken(content:String){
    // if token is not found, returns a list; otherwise return null
    // TODO: always handle null; when used this function.
    const pattern = /(((github)?|(repo)?|(gh)?|(pat)?){1}([_,-]token)|(token))/gmi
    const matches = content.match(pattern)
    return matches !== null ? matches.filter((value, index, self)=> self.indexOf(value)===index) : null // returning only unique matches.
}

export function printArray(arr, header){
    info(`${header}`)
    for(let elem of arr){
        info(`-->${elem}`)
    }
}

export async function comment(client, repos, issue_id, body){
    await client.rest.issues.createComment({
        ...repos,
        issue_number: Number(issue_id),
        body: body
    })
}