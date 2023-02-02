const { updateDinoPriceAndTier } = require("../../functions/connectors/mongodb-connector");
const config = require('../../cfg/config.json');

exports.run = async (client, message, args) =>{
    if(args.length != 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}changeprice [dinoName] [dinoPrice] [dinoTier]\`\nExample:\n\`${config.prefix}changeprice Utah 200000 7\``);
    }

    if(await updateDinoPriceAndTier(message, args[0].toLowerCase(), args[1], args[2]) != null) return message.reply("Price change successful");
}