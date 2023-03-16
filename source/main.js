const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
require('log-timestamp')(() => {return new Date().toISOString() + " %s"});
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const config = require('./cfg/config.json');
const { getServerInfo } = require("./functions/api/steam-api");
client.commands = new Collection();
chalk = require('chalk');
client.config = config;

//Reading files under the events directory
fs.readdir("./source/events/", (err, files) => {
    if (err) return console.error(err);
    //Looping through each file under events folder
    files.forEach(file => {
      const event = require(`./events/${file}`);
      //Grabbing event name by parsing file name
      let eventName = file.split(".")[0];
      //Creating a listener for each defined event
      client.on(eventName, event.bind(null, client));
    });
  });
  
  //Reading files under the commands directory
  fs.readdir("./source/commands/", (err, files) => {
    if (err) return console.error(err);
    //Looping through each file under the commands folder
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let args = require(`./commands/${file}`);
      //Grabbing event name by parsing file name
      let commandName = file.split(".")[0];
      console.log(chalk.green(`[+] ${commandName}`));
      //Creating a listener for each defined event
      client.commands.set(commandName, args);
    });
  });

  //Reading files under the admin commands directory
  fs.readdir("./source/commands/admin/", (err, files) => {
    if (err) return console.error(err);
    //Looping through each file under the commands folder
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let args = require(`./commands/admin/${file}`);
      //Grabbing event name by parsing file name
      let commandName = file.split(".")[0];
      console.log(chalk.yellow(`[+] ${commandName}`));
      //Creating a listener for each defined event
      client.commands.set(commandName, args);
    });
  });

client.on("ready", async() => {
  client.user.setActivity(`the Admins`, { type: ActivityType.Watching });
});

// Handles Player count display
const updateBotActivityWithPlayerCount = async() => {
  setTimeout(async () => {
    client.user.setActivity(await getServerInfo(), { type: ActivityType.Watching });
    updateBotActivityWithPlayerCount();
  }, 5000);
}

updateBotActivityWithPlayerCount();

client.login(config.token)