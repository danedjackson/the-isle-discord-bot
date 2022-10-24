const chalk = require("chalk")
const config = require("../cfg/config.json")
module.exports = (client) => {
    console.log(chalk.magenta(`Bot Made by Blemished#0028 \nPrefix is ${config.prefix}`));
}
