const { priceEmbed } = require('../functions/price/priceEmbed');


exports.run = async (client, message, args) =>{

    await priceEmbed(message);

}