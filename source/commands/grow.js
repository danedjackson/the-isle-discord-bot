const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoInfo');

const { queueHandler } = require("../functions/handlers/queue-handler");
const { checkRequestForSub } = require('../functions/helper');

exports.run = async (client, message, args) =>{
    if (args.length != 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}grow [dino] [steam ID] [safelogged status]\`\nExample:\n\`${config.prefix}grow Utah 76561198877008754 Y\``);
    }

    var requestedDinoName = args[0];
    var steamId = args[1];
    var isSafelogged = args[2];

    if (!/^\d+$/.test(steamId)) {
        message.reply(`invalid steamId entered.`);
        return;
    }

    //Checks if safelog flag starts with y
    if(!isSafelogged.toLowerCase().startsWith('y')) {
        message.reply(`you must be safelogged before requesting a dinosaur.`);
        return;
    }
    
    requestedDinoName = checkRequestForSub(requestedDinoName);

    //Check if requested dino name is valid
    try{
        await mongoose.connect(config.mongodb.uri);
        
        //Test requested dino if it's for a sub
        requestedDinoName = checkRequestForSub(requestedDinoName);
        
        var dinoInfo = await DinoInfo.find( {codeName: requestedDinoName.toLowerCase()} );
        if(dinoInfo.length < 1) {
            message.reply(`Incorrect dino name entered, please try again.`);
            return;
        }
    } catch (err) {
        console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
        return;
    } 
    //Format code name for dinosaur to grow
    var dinoName = dinoInfo[0].survival && !dinoInfo[0].toString().includes("subs") ? dinoInfo[0].codeName + "AdultS" : dinoInfo[0].codeName;
    
    //Capitalizing first letter of dinosaur name for the JSON filename
    dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
    var dinoPrice = dinoInfo[0].price;

    await queueHandler( ["grow", dinoName, dinoPrice, steamId, message] );

}