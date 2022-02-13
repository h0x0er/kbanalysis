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

export async function getActionYaml(client: any, owner: String, repo: String ){
    
    let true_repo:String = ""
    let path = ""
    if(repo.indexOf("/") > 0){
        // nested repo.
        const repo_split = repo.split("/")
        true_repo = repo_split[0] // first part is true_name of repo
        path = repo_split.slice(1,).join("/")
    }else{
        true_repo = repo
    }
    const action_data =  await client.rest.repos.getContent({owner: owner, repo: true_repo,path: path+"/action.yml"})
    // printing base64 encoded content.
    const encoded_content = action_data.data["content"].split("\n")
    const content = encoded_content.join("")
    return Buffer.from(content, "base64").toString() // b64 decoding before returning
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