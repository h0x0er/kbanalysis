export function isKBIssue(title:String){
    const prefix = "[KB] Add KB for"
    const index = title.indexOf(prefix)
    return index === 0

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
    const action_data =  await client.rest.repos.getContent({owner: owner, repo: repo,path: "/action.yml"})
    // printing base64 encoded content.
    const encoded_content = action_data.data["content"].split("\n")
    const content = encoded_content.join("")
    return Buffer.from(content, "base64").toString() // b64 decoding before returning
}

export async function findToken(content:String){
    // if token is not found, returns list with null string
    const pattern = /(((github)?|(repo)?|(gh)?|(pat)?){1}([_,-]token)|(token))/gmi
    const matches = content.match(pattern)
    return matches.filter((value, index, self)=> self.indexOf(value)===index) // returning only unique matches.
}