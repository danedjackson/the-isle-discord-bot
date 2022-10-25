const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const config = require('./cfg/config.json')
client.commands = new Collection();
chalk = require('chalk');
client.config = config;

//Reading files under the events directory
fs.readdir("./events/", (err, files) => {
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
  fs.readdir("./commands/", (err, files) => {
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

client.on("ready", () => {
  client.user.setActivity('Set Activity', { type: 'WATCHING' });
});

client.login(config.token)