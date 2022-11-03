const {  downloadFile, injectEdit, uploadFile } = require('../ftp');


const growProcess = async (request) => {
    var response;
    request.shift();
    var [dinoName, dinoGender, dinoPrice, steamId, message] = request;

    response = await downloadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong checking the server, please try again.`);
    response = await injectEdit(dinoName, dinoGender, steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong while making changes to your dino, please try again.`);
    response = await uploadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong connecting to the server, please try again.`);

    return message.reply(`Your dino was grown successfully`);
}

const responseCheck = (response) => {
    return (response != "Ok") ? false : true;
}

module.exports = { growProcess }