const { EmbedBuilder } = require ("discord.js");
const mongoose = require('mongoose');

const config = require('../cfg/config.json');
const User = require('../models/user');
const { queueHandler } = require("../functions/queue-handler");

exports.run = async (client, message, args) =>{
    
    //If direct command with parameters used :
    if (args.length != 0) {
        var requestedDinoName = args[0];
        var requestedServer = args[1];
        var isSafelogged = args[2];

        //Checks if server is numerical
        try{
            requestedServer = parseInt(requestedServer);
        } catch(err){
            message.reply(`something was wrong with your request. Please enter a correct server number.`);
            console.error(`${message.author.username} | invalid server entered in buy command`);
            return;
        }


        //Checks if safel;og flag starts with y
        if(!isSafelogged.toLowerCase().startsWith('y')) {
            message.reply(`you must be safelogged before requesting a dinosaur.`)
            return;
        }

        //Check if requested dino name is valid
        try{
            await mongoose.connect(config.mongodb.uri);
            // const u = new User({discordId: "192341253", steamId: "82471829271"});
            // await u.save();
            var userInfo = await User.find();
            console.log(userInfo);
            return;
        } catch (err) {
            console.error(err);
            return;
        } 
    }


    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    message.reply({ embeds: [exampleEmbed] });  
}