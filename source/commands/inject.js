const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoInfo');
const { getUserInfoByDiscordId } = require('../functions/connectors/mongodb-connector');
const { queueHandler } = require("../functions/handlers/queue-handler");
const { checkRequestForSub } = require('../functions/helper');

exports.run = async (client, message, args) =>{
    if (args.length != 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}inject [dino] [gender] [safelogged status]\`\nExample:\n\`${config.prefix}inject Utah M Y\``);
    }

    let requestedDinoName = args[0];
    const dinoGender = args[1];
    const userInfo = await getUserInfoByDiscordId(message);
    const steamId = userInfo.steamId;
    const isSafelogged = args[2];

    if (steamId === null || steamId === undefined) {
        message.reply(`you need to link your steam ID using the ${config.prefix}link command to inject.`);
        return;
    }

    if (!/^\d+$/.test(steamId)) {
        message.reply(`invalid steamId entered.`);
        return;
    }

    if(!dinoGender.toLowerCase().startsWith("m") && !dinoGender.toLowerCase().startsWith("f")){
        message.reply(`invalid gender selected.`)
        return;
    }

    //Checks if safelog flag starts with y
    if(!isSafelogged.toLowerCase().startsWith('y')) {
        message.reply(`you must be safelogged before requesting a dinosaur.`);
        return;
    }
    
    requestedDinoName = checkRequestForSub(requestedDinoName);

    const dinoInfo = getDinoInfo(message, requestedDinoName);
    if (dinoInfo.length < 1) return;

    //Format code name for dinosaur to grow
    let dinoName = dinoInfo[0].survival && !dinoInfo[0].toString().includes("subs") ? dinoInfo[0].codeName + "AdultS" : dinoInfo[0].codeName;
    
    //Capitalizing first letter of dinosaur name for the JSON filename
    dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
    const dinoPrice = dinoInfo[0].price;

    await queueHandler( ["inject", dinoName, dinoGender, dinoPrice, steamId, message] );

}