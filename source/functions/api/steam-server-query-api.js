const { queryGameServerInfo } = require('steam-server-query');
const config = require('../../cfg/config.json');

const getServerPopulation = async () => {
    
    var response = queryGameServerInfo(`${config.serverInfo.server}:${config.serverInfo.queryPort}`).then( info => {
        return `${info.players} / ${info.maxPlayers} Players`;
    }).catch((err) => {
        console.error(err.stack);
        return `the Admins`;
    });
    return response;
}

module.exports = { getServerPopulation }