#!/usr/bin/env node
"use strict";
/* IMPORTING LIBRARIES */
const fs=require("fs")//file system
const path=require("path")
const zlib=require("zlib")
const Transform=require("stream").Transform
const minmist=require("minimist")

const args=minmist(process.argv.slice(2),{
    boolean:["help","zip","unzip"],
    string:["file"]
})
/********************* */

/* ARGUMENT LOGIC */
const BASE_PATH=path.resolve(process.env.BASE_PATH||__dirname)

if(args.help){
    showHelp()
}
else if(args.file){
    if(args.zip){
        let filepath=path.join(BASE_PATH,args.file)
        zipFile(filepath)
    }
    else if(args.unzip){
        let filepath=path.join(BASE_PATH,args.file)
        unzipFile(filepath)
    }
    else{
        error("invalid use",true)
    }
}
else{
    error("Invalid usage",true)
}
/************** */

/* FUNCTIONS */
function showHelp(){
    console.log("")
    console.log("--help .......... Show help")
    console.log("--file .......... Select file")
    console.log("--zip  .......... Compress file")
    console.log("")
}

function error(message,help=false){
    console.error(message)
    if(help){
        showHelp()
    }
}

function zipFile(filepath){
    const OUT_FILE=path.join(BASE_PATH,"lastzipped.txt.gz")
    let inStream=fs.createReadStream(filepath)//establish stream connection to file
    let gzipStream=zlib.createGzip()//create zip transformation stream
    inStream=inStream.pipe(gzipStream)//pipe transformation stream to inStream
    let targetStream=fs.createWriteStream(OUT_FILE)//create outstream to target file
    inStream=inStream.pipe(targetStream)//pipe target file outstream
}

function unzipFile(filepath){
    const OUT_FILE=path.join(BASE_PATH,"lastunzipped.txt")
    let inStream=fs.createReadStream(filepath)
    let gunzipStream=zlib.createGunzip()
    inStream=inStream.pipe(gunzipStream)
    let targetStream=fs.createWriteStream(OUT_FILE)
    inStream=inStream.pipe(targetStream)
}
/********** */