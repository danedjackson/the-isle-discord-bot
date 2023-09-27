const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoInfo');

const { queueHandler } = require("../functions/handlers/queue-handler");
const { getDinoInfo } = require("../functions/connectors/mongodb-connector");

exports.run = async (client, message, args) =>{
    if (args.length != 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}grow [dino] [steam ID] [safelogged status]\`\nExample:\n\`${config.prefix}grow Utah 76561198877008754 Y\``);
    }

    let requestedDinoName = args[0];
    const steamId = args[1];
    const isSafelogged = args[2];
    let dinoName;

    if (!/^\d+$/.test(steamId)) {
        message.reply(`invalid steamId entered.`);
        return;
    }

    //Checks if safelog flag starts with y
    if(!isSafelogged.toLowerCase().startsWith('y')) {
        message.reply(`you must be safelogged before requesting a dinosaur.`);
        return;
    }

    const dinoInfo = getDinoInfo(message, requestedDinoName);
    if (dinoInfo.length < 1) return;

    //Format code name for dinosaur to grow
    dinoName = dinoInfo[0].survival && !dinoInfo[0].toString().includes("subs") ? dinoInfo[0].codeName + "AdultS" : dinoInfo[0].codeName;
    
    //Capitalizing first letter of dinosaur name for the JSON filename
    dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
    
    const dinoPrice = dinoInfo[0].price;

    await queueHandler( ["grow", dinoName, dinoPrice, steamId, message] );

}