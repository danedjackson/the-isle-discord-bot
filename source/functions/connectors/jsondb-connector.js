const fs = require('fs');
const path = require('path');
const dinoInfos = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/dinoInfo.json")));

const handleError = (message, err) => {
    console.error(`${message.author.username} | something went wrong connecting to json DB:\n${err.stack}`);
    message.reply(`Something went wrong on the server. Please try again later.`);
}

const getDinoInfo = async(message, requestedDinoName) => {
    //Check if requested dino name is valid
    let dinoInfo = [];
    try {
        for (var x = 0; x < dinoInfos.length; x++) {
            if (dinoInfos[x].codeName.toLowerCase() == requestedDinoName.toLowerCase()) {
                dinoInfo.push(dinoInfos[x]);
                break;
            }
        } 
    }
    catch(err) {
        handleError(message, err);
        return dinoInfo;
    }
    
    return dinoInfo;
}

const getAllDinoInfo = async(message) => {
   return dinoInfos;
}

const getHighestDinoTier = async(message) => {
   let dinoInfo = [];
   const highest = 1;
   
    for(var i = 0; i < dinoInfos.length; i++) {
        if (highest < parseInt(dinoInfos[i].tier)) {
            dinoInfo = dinoInfos[i];
        }
    }

   return dinoInfo;
}

module.exports = { getDinoInfo, getAllDinoInfo, getHighestDinoTier }