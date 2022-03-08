import {exec } from "child_process";
import * as core from "@actions/core";

export async function createPR(client, content:String, path:String){

    exec("ls -lah", async (error, stdout, stderr)=>{

        if(error){core.warning(`Error occurred: ${error}`)}
        if(stderr){core.warning(`Error occurred: ${stderr}`)}

        if(stdout){core.warning(`Error occurred: ${stdout}`)}

    })  

}