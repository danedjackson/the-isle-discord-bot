const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const config = require('../cfg/config.json');

const serverIp = config.serverInfo.server;
const ftpLocation = config.serverInfo.ftpLocation;
const ftpPort = config.serverInfo.port;
const ftpUsername = config.serverInfo.username;
const ftpPassword = config.serverInfo.password;

const ftpClient = new ftp.Client();

const serverConnection = async () => {
    // if the ftp client connection isn't closed, then reuse the connection
    if(!ftpClient.closed) return true;

    try {
        ftpClient.ftp.ipFamily = 4;
        await ftpClient.access({
            host: serverIp,
            port: ftpPort,
            user: ftpUsername,
            password: ftpPassword
        }); 
        return true;
    } catch(err) {
        console.error(`something went wrong trying to connect to the FTP server:\n${err}`);
        return false;
    }
}

const deleteLocalFile = async (fileId) => {
    console.log("Deleting local files . . .");
    fs.unlink("./" + fileId + ".json", (err) => {
        if (err) console.error(err);
    });
}

const downloadFile = async (steamId) => {
    console.log(`Downloading file. . . ${serverIp}${ftpLocation}${steamId}.json`);
    try {
        if (!await serverConnection()) return `something went wrong connecting to the server, please try again`;
        await ftpClient.downloadTo(steamId + ".json", `${serverIp}${ftpLocation}${steamId}.json`);
        ftpClient.close();
        return("Ok");
    } catch ( err ) {
        console.error(`Error while downloading file: ${err.stack}`);
        ftpClient.close();
        return(`something went wrong injecting your dino. Please try again.`);
    }
}

const growEdit = async(dinoName, steamId) => {
    console.log(`Editing file to grow Dino. . . `);
    try{
        var data = fs.readFileSync(`${steamId}.json`, `utf-8`);
        var contents = JSON.parse(data);
        var height;

        //Comparing if requested dino is the same as current dino
        if(!contents.CharacterClass.toString().toLowerCase().includes(dinoName.toLowerCase())) {
            deleteLocalFile(steamId);
            return (`unable to grow a(n) ${dinoName.substring(0, dinoName.indexOf("AdultS")) || dinoName} since your current dino is not this species.`);
        }

        //If already fully grown, do not process.
        if(contents.CharacterClass.toString().toLowerCase().includes("adults") && parseFloat(contents.Growth) == 1) {
            deleteLocalFile(steamId);
            return ("dino is already fully grown.");
        }

        dinoName.toLowerCase() == "spino" ? height = 200 : height = 100;
        contents.CharacterClass = dinoName;
        contents.Growth = "1.0";
        contents.Hunger = "9999";
        contents.Thirst = "9999";
        contents.Stamina = "9999";
        contents.Health = "15000";
        //Prevent fall through map
        var locationParts;
        locationParts = contents.Location_Isle_V3.split("Z=", 2);
        locationParts[1] = parseFloat(locationParts[1]);
        locationParts[1] += height;
        locationParts[0] += "Z=";
        locationParts[1] = locationParts[1].toString();
        var completed = locationParts[0] + locationParts[1];
        contents.Location_Isle_V3 = completed;
        

        fs.writeFileSync(`${steamId}.json`, JSON.stringify(contents, null, 4));
        return ("Ok");
    } catch ( err ) {
        console.error(`Something went wrong editing file information: ${err.stack}`);
        return(`something went wrong growing your dino. Please try again.`);
    }
}

const injectEdit = async(dinoName, dinoGender, steamId) => {
    console.log(`Editing file to grow Dino. . . `);
    try{
        var data = fs.readFileSync(`${steamId}.json`, `utf-8`);
        var contents = JSON.parse(data);
        var height;
        dinoName.toLowerCase() == "spino" ? height = 200 : height = 100;
        contents.bGender = dinoGender.toLowerCase().startsWith("m") ? false : true;
        contents.CharacterClass = dinoName;
        contents.Growth = "1.0";
        contents.Hunger = "9999";
        contents.Thirst = "9999";
        contents.Stamina = "9999";
        contents.Health = "15000";
        //Prevent fall through map
        var locationParts;
        locationParts = contents.Location_Isle_V3.split("Z=", 2);
        locationParts[1] = parseFloat(locationParts[1]);
        locationParts[1] += height;
        locationParts[0] += "Z=";
        locationParts[1] = locationParts[1].toString();
        var completed = locationParts[0] + locationParts[1];
        contents.Location_Isle_V3 = completed;
        

        fs.writeFileSync(`${steamId}.json`, JSON.stringify(contents, null, 4));
        return ("Ok");
    } catch ( err ) {
        console.error(`Something went wrong editing file information: ${err.stack}`);
        return(`something went wrong injecting your dino. Please try again.`);
    }
}

const uploadFile = async(steamId) => {
    console.log(`Uploading file. . .`);
    try {
        if (!await serverConnection()) return `something went wrong connecting to the server, please try again`;
        var status = await ftpClient.uploadFrom(`${steamId}.json`, `${serverIp}${ftpLocation}${steamId}.json`);
        var retryCount = 0;
        while (status.code != 226 && retryCount < 2) {
            status = await ftpClient.uploadFrom(`${steamId}.json`, `${serverIp}${ftpLocation}${steamId}.json`);
            retryCount++;
        }
        if (status.code != 226) {
            console.log(`Status code from file upload attempt: ${status.code}`);
            deleteLocalFile(steamId);
            ftpClient.close();
            return(`something went wrong trying to get dino info. . . Try again please.`);
        }
        deleteLocalFile(steamId);
        return("Ok");
    } catch( err ) {
        console.error(`Error occurred trying to upload file: ${err.stack}`);
        ftpClient.close();
        return(`something went wrong. Try again please.`);
    }
}

module.exports = { downloadFile, growEdit, injectEdit, uploadFile }