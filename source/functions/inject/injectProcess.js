const {  downloadFile, injectEdit, uploadFile } = require('../ftp');
const { checkBalance, makePayment } = require('../handlers/payment-handler');

const injectProcess = async (request) => {
    var response;
    request.shift();
    var [dinoName, dinoGender, dinoPrice, steamId, message] = request;

    if(!await checkBalance(dinoPrice, message.author.id)) return message.reply(`You do not have enough points for this dino.`);


    response = await downloadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong checking the server, please try again.`);
    response = await injectEdit(dinoName, dinoGender, steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong while making changes to your dino, please try again.`);
    response = await uploadFile(steamId);
    if (!responseCheck(response)) return message.reply(`Something went wrong connecting to the server, please try again.`);

    if (await makePayment(dinoPrice, message.author.id) == false) console.error(`Could not deduct ${dinoPrice} from ${message.author.username} (${message.author.id})`);

    return message.reply(`Your dino was grown successfully`);
}

const responseCheck = (response) => {
    if (response != "Ok") {
        console.error(response);
        return false;
    } else {
        return true;
    }
}

module.exports = { injectProcess }