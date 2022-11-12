const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const User = require('../models/user');
const DinoInfo = require('../models/dinoInfo');

const { queueHandler } = require("../functions/handlers/queue-handler");
const { checkRequestForSub } = require('../functions/helper');

exports.run = async (client, message, args) =>{
    if (args.length != 4) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}inject [dino] [gender] [steam ID] [safelogged status]\`\nExample:\n\`${config.prefix}inject Utah M 76561198877008754 Y\``);
    }

    var requestedDinoName = args[0];
    var dinoGender = args[1];
    var steamId = args[2];
    var isSafelogged = args[3];

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

    //Check if requested dino name is valid
    try{
        await mongoose.connect(config.mongodb.uri);
        
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
    var dinoName = dinoInfo[0].survival ? dinoInfo[0].codeName + "AdultS" : dinoInfo[0].codeName;
    //Capitalizing first letter of dinosaur name for the JSON filename
    dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
    var dinoPrice = dinoInfo[0].price;

    await queueHandler( ["inject", dinoName, dinoGender, dinoPrice, steamId, message] );

}