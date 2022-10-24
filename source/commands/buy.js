const discord = require ("discord.js");

const { queueHandler } = require("../functions/queue-handler")

exports.run = async (client, message, args) =>{
    await queueHandler(`Eyo ${args[0]}`);

}