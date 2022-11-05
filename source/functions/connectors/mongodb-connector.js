const mongoose = require('mongoose');
const config = require('../../cfg/config.json');
const User = require('../../models/user');
const DinoInfo = require('../../models/dinoInfo');

const getDinoInfo = async(message, requestedDinoName) => {
     //Check if requested dino name is valid
     var dinoInfo = [];
     try{
        await mongoose.connect(config.mongodb.uri);
        
        dinoInfo = await DinoInfo.find( {codeName: requestedDinoName.toLowerCase()} );
        if(dinoInfo.length < 1) {
            message.reply(`Incorrect dino name entered, please try again.`);
            return dinoInfo;
        }
    } catch (err) {
        console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
        return dinoInfo;
    } 

    return dinoInfo;
}

module.exports = { getDinoInfo }