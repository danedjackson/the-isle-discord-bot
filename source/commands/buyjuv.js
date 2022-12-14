const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const User = require('../models/user');
const DinoInfo = require('../models/dinoInfo');

const { queueHandler } = require("../functions/handlers/queue-handler");

exports.run = async (client, message, args) =>{
    
    //If direct command with parameters used :
    if (args.length != 0) {
        var requestedDinoName = args[0];
        var isSafelogged = args[1];
        var steamId = args[2];

        //Check if steamId is numeric


        //Checks if safelog flag starts with y
        if(!isSafelogged.toLowerCase().startsWith('y')) {
            message.reply(`you must be safelogged before requesting a dinosaur.`);
            return;
        }

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
        if (dinoInfo[0].survival) {
            dinoName = dinoInfo[0].codeName + "JuvS";
        } else {
            return message.reply(`Grows for non-survival juveniles are not available at the moment.`);
        }
        //Capitalizing first letter of dinosaur name for the JSON filename
        dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);

        await queueHandler( ["grow", dinoName, 0, steamId, message] );
    }
}