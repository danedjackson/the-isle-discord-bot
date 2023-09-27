const mongoose = require('mongoose');
const config = require('../../cfg/config.json');
const User = require('../../models/user');
const DinoInfo = require('../../models/dinoInfo');
const { checkRequestForSub } = require('../../functions/helper');

const mongoConnect = async() => {
    try {
        return await mongoose.connect(config.mongodb.uri);
    } catch (err) {
        console.error(err.stack);
    }
}

const handleError = (message, err) => {
    console.error(`${message.author.username} | something went wrong connecting to mongo DB:\n${err.stack}`);
    message.reply(`Something went wrong on the server. Please try again later.`);
}

const getDinoInfo = async(message, requestedDinoName) => {
     //Check if requested dino name is valid
     let dinoInfo = [];
     try{

        //Alters String to suit Sub naming convention if a sub is requested
        requestedDinoName = checkRequestForSub(requestedDinoName);

        const connection = await mongoConnect(message);

        dinoInfo = await DinoInfo.find( {codeName: requestedDinoName.toLowerCase()} );

        connection.disconnect();
        
        if(dinoInfo.length < 1) {
            message.reply(`Incorrect dino name entered, please try again.`);
            return dinoInfo;
        }
    } catch (err) {
        handleError(message, err);
        return dinoInfo;
    } 

    return dinoInfo;
}

const getAllDinoInfo = async(message) => {
    let dinoInfo = [];
    try{
        const connection = await mongoConnect(message);

        dinoInfo = await DinoInfo.find();
        connection.disconnect();

    } catch (err) {
        handleError(message, err);
        return dinoInfo;
    } 

    return dinoInfo;
}

const getHighestDinoTier = async(message) => {
    let highest;
    try{
        const connection = await mongoConnect(message);
        highest = await DinoInfo.find().sort( {tier:-1} ).limit(1);
        highest = highest[0].tier;
        connection.disconnect();
    } catch (err) {
        handleError(message, err);
        return highest;
    } 
    return highest;
}

const getUserInfoByDiscordId = async(message) => {
    let userInfo;
    try {
        const connection = await mongoConnect(message);
        userInfo = await User.findOne( {discordId: message.author.id} );
        connection.disconnect();
    } catch (err) {
        handleError(message, err);
        return "error";
    }
    return userInfo;
}

const getUserInfoBySteamId = async(message, steamId) => {
    let userInfo;
    try {
        const connection = await mongoConnect(message);

        userInfo = await User.findOne( {steamId: steamId} ).exec();
        connection.disconnect();
    } catch (err) {
        handleError(message, err);
        //Avoid the returning of null, since a null is a positive return type for this function in some cases.
        return "error";
    }
    return userInfo;
}

const addUserInfo = async(message, steamId) => {
    try {
        const newUser = new User({
            discordId: message.author.id,
            steamId: steamId,
        });

        const connection = await mongoConnect(message);

        await newUser.save();
        connection.disconnect();
        return true;
    } catch (err) {
        handleError(message, err);
        return false;
    }
}

const updateDinoPriceAndTier = async (message, codeName, newPrice, newTier) => {
    let dinoInfo;
    try {
        const connection = await mongoConnect(message);
        dinoInfo = await DinoInfo.findOne( {codeName: codeName} );
    } catch(err) {
        handleError(message, err);
        return dinoInfo;
    }
    if (dinoInfo == null){
        message.reply(`Could not find dino information for ${codeName}`);
        return dinoInfo;
    }

    let updatedDinoInfo = dinoInfo;
    updatedDinoInfo.price = newPrice;
    updatedDinoInfo.tier = newTier;

    updatedDinoInfo = await updatedDinoInfo.save();
    connection.disconnect();
    return updatedDinoInfo;
}

module.exports = { getDinoInfo, getAllDinoInfo, getHighestDinoTier, getUserInfo: getUserInfoBySteamId, addUserInfo, updateDinoPriceAndTier, getUserInfoByDiscordId }
