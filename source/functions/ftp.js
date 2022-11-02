const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const config = require('../cfg/config.json');

const serverIp = config.serverInfo.server;
const ftpLocation = config.serverInfo.ftpLocation;
const ftpPort = config.serverInfo.port;
const ftpUsername = config.serverInfo.username;
const ftpPassword = config.serverInfo.password;

const serverConnection = async (client) => {
    await client.access({
        host: serverIp,
        port: ftpPort,
        user: ftpUsername,
        password: ftpPassword
    });

    return client;
}

async function deleteLocalFile(fileId) {
    console.log("Deleting local files . . .");
    fs.unlink("./" + fileId + ".json", (err) => {
        if (err) console.error(err);
    });
}

const downloadFile = async (steamId) => {
    var ftpClient = new ftp.Client();
    console.log(`Downloading file. . . ${serverIp}${ftpLocation}${steamId}.json`);
    ftpClient.ftp.ipFamily = 4;
    try {
        ftpClient = await serverConnection(ftpClient);
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
        if(contents.bBrokenLegs) {
            return (`your dino's leg is broken, please heal the leg and try again.`);
        }
        if(contents.BleedingRate.localeCompare("0") !== 0) {
            return(`your dino is bleeding, please heal the bleed and try again.`);
        }
        var height;
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
        return(`something went wrong injecting your dino. Please try again.`);
    }
}

const uploadFile = async(steamId) => {
    var ftpClient = new ftp.Client();
    console.log(`Uploading file. . .`);
    ftpClient.ftp.ipFamily = 4;
    try {
        ftpClient = await serverConnection(ftpClient);
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

module.exports = { downloadFile, growEdit, uploadFile }