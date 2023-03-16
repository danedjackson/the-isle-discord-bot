
const gamedig = require('gamedig');

const getServerInfo = async () => {
    const serverInfo = {
      currentPlayers: 0,
      maxPlayers: 125
    };
  
    try {
      const state = await gamedig.query({
        type: 'tf2',
        host: '104.206.80.154',
        port: '14010'
      });
  
      serverInfo.currentPlayers = state.players.length;
      serverInfo.maxPlayers = state.maxplayers;
    } catch (error) {
      console.error(error);
    }
  
    return `${serverInfo.currentPlayers} / ${serverInfo.maxPlayers} Players`;
  }


module.exports = { getServerInfo }