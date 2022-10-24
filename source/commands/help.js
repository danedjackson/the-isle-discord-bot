const discord = require ("discord.js");

exports.run = (client, message, args) =>{
    const help = new discord.MessageEmbed()
    .setColor('#b434eb')
    .setTitle('BOT Template')
    .setURL("https://github.com/LachlanDev/Discord-BOT-Template")
    .addField("Info", "Placeholder.")
    .setFooter(message.author.username, message.author.displayAvatarURL)
    message.channel.send({embed: help })
};
