const mongoose = require('mongoose');
const config = require('../../cfg/config.json');
const User = require('../../models/user');
const DinoInfo = require('../../models/dinoInfo');

const mongoConnect = async(message) => {
    try {
        return await mongoose.connect(config.mongodb.uri);
    } catch (err) {
        console.error(err.stack);
    }
}

const getDinoInfo = async(message, requestedDinoName) => {
     //Check if requested dino name is valid
     var dinoInfo = [];
     try{
        var connection = await mongoConnect(message);

        dinoInfo = await DinoInfo.find( {codeName: requestedDinoName.toLowerCase()} );

        connection.disconnect();
        
        if(dinoInfo.length < 1) {
            message.reply(`Incorrect dino name entered, please try again.`);
            return dinoInfo;
        }
    } catch (err) {
        console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err.stack}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
        return dinoInfo;
    } 

    return dinoInfo;
}

const getAllDinoInfo = async(message) => {
    var dinoInfo = [];
    try{
        var connection = await mongoConnect(message);

        dinoInfo = await DinoInfo.find();
        connection.disconnect();

    } catch (err) {
        console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err.stack}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
        return dinoInfo;
    } 

    return dinoInfo;
}

const getHighestDinoTier = async(message) => {
    var highest;
    try{
        var connection = await mongoConnect(message);
        highest = await DinoInfo.find().sort( {tier:-1} ).limit(1);
        highest = highest[0].tier;
        connection.disconnect();
    } catch (err) {
        console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err.stack}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
        return highest;
    } 
    return highest;
}

module.exports = { getDinoInfo, getAllDinoInfo, getHighestDinoTier }