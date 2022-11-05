const { getDinoInfo } = require('../functions/connectors/mongodb-connector');

const { queueHandler } = require("../functions/handlers/queue-handler");

exports.run = async (client, message, args) =>{
    
    //If direct command with parameters used :
    if (args.length != 0) {
        var requestedDinoName = args[0];
        var isSafelogged = args[1];
        var steamId = args[2];

        //Check if steamId is numeric


        //Checks if safelog flag starts with y
        if(!isSafelogged.toLowerCase().startsWith('y')) {
            message.reply(`you must be safelogged before requesting a dinosaur.`);
            return;
        }

        //Check if requested dino name is valid
        var dinoInfo = await getDinoInfo(message, requestedDinoName);
        if (dinoInfo == []) return;
        
        //Format code name for dinosaur to grow
        var dinoName = dinoInfo[0].survival ? dinoInfo[0].codeName + "AdultS" : dinoInfo[0].codeName;
        //Capitalizing first letter of dinosaur name for the JSON filename
        dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
        var dinoPrice = dinoInfo[0].price;

        await queueHandler( ["grow", dinoName, dinoPrice, steamId, message] );
    }
}