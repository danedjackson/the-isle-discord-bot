const fs = require('fs');
const path = require('path');
var dinoInfos = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/prices.json")));

const getDinoInfo = async(message, requestedDinoName) => {
    //Check if requested dino name is valid
    var dinoInfo = [];
    try {
        for (var x = 0; x < dinoInfos.length; x++) {
            if (dinoInfos[x].codeName.toLowerCase() == requestedDinoName.toLowerCase()) {
                dinoInfo.push(dinoInfos[x]);
                break;
            }
        } 
    }
    catch(err) {
        console.error(`${message.author.username} (JSON DB) | something went wrong connecting to mongo DB:\n${err.stack}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
    }
    
    return dinoInfo;
}

const getAllDinoInfo = async(message) => {
   return dinoInfos;
}

const getHighestDinoTier = async(message) => {
   var dinoInfo;
   var highest = 1;
   
    for(var i = 0; i < dinoInfos.length; i++) {
        if (highest < parseInt(dinoInfos[i].tier)) {
            dinoInfo = dinoInfos[i];
        }
    }

   return dinoInfo;
}

module.exports = { getDinoInfo, getAllDinoInfo, getHighestDinoTier }