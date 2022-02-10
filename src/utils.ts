export function isKBIssue(title:String):boolean{
    const prefix = "[KB] Add KB for"
    const index = title.indexOf(prefix)
    return index === 0

}

export function getAction(title:String):String{
    const splits = title.split(" ")
    const name = splits[-1]
    return name;
}