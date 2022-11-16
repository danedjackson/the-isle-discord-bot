const config = require('../cfg/config.json');
const { getUserInfo, addUserInfo } = require('../functions/connectors/mongodb-connector');

exports.run = async (client, message, args) =>{ 

    if(args.length != 1) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}link [steam ID]\`\nExample:\n\`${config.prefix}link 76561198877008754\``);
    }

    if (!/^\d+$/.test(args[0]) || !args[0].toString().startsWith("7656") || args[0].length != 17) {
        message.reply(`invalid steamId entered.`);
        return;
    }

    var userInfo = await getUserInfo(message, args[0]);

    if (userInfo == "error") return;
    
    if (userInfo != null) {
        message.reply("This steam ID is already linked to another user.");
        return;
    } 

    if (userInfo == null) {
        if ( await addUserInfo(message, args[0]) ) {
            console.log(`${message.author.username} linked their steam ID (${args[0]})`)
            message.reply("Your Steam ID has been linked!");
            return;
        } else {
            message.reply("Something went wrong linking your steam ID.");
            return;
        }
    }
}