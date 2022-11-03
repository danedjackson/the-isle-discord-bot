const {  downloadFile, growEdit, uploadFile } = require('../ftp');
const { makePayment } = require('../handlers/payment-handler');

const growProcess = async (request) => {
    var response;
    request.shift();
    var [dinoName, dinoPrice, steamId, message] = request;

    if (await makePayment(dinoPrice, message.author.id) == false) return message.reply(`You do not have enough points for this dino.`);

    response = await downloadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong checking the server, please try again.`);
    response = await growEdit(dinoName, steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong while making changes to your dino, please try again.`);
    response = await uploadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong connecting to the server, please try again.`);

    return message.reply(`Your dino was grown successfully`);
}

const responseCheck = (response) => {
    return (response != "Ok") ? false : true;
}

module.exports = { growProcess }