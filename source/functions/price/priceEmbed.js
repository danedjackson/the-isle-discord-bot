const { EmbedBuilder } = require('discord.js');
const { getAllDinoInfo, getHighestDinoTier } = require('../connectors/mongodb-connector');

const priceEmbed = async(message) => {

    var dinoInfos = await getAllDinoInfo(message);
    var maxDinoTier = await getHighestDinoTier(message);   

    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Dinosaur Price List')
    .setDescription('List of prices for all Legacy dinos.')
    //Iterate through all dinosaur tiers found in db
    for(let i = 1; i <= maxDinoTier; i++) {
        var dinoName = [];
        //Getting dino price by tier
        var dinoPrice = dinoInfos.find( dino => parseInt(dino.tier) == parseInt(i) );
        
        //Create list of dinosaurs under each dinosaur tier found in database
        for(let x = 0; x < dinoInfos.length; x++) {
            if(parseInt(dinoInfos[x].tier) == parseInt(i)) {
                dinoName.push(dinoInfos[x].name);
            }
        }   
        //If dino is found under tiers, create embed field
        if(dinoName.length != 0 && dinoPrice != undefined) {
            embed.addFields(
                { name: `Tier ${i} - ${dinoPrice.price} :moneybag:`, value: `- ${dinoName.join(',').replace(/,/g, '\n- ').split()}`, inline: i%3 == 0 ? false : true }
            )
        }
    }
    

    message.reply( { embeds: [embed] })
}


module.exports = { priceEmbed }