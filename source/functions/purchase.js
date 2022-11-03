//Logic for checking user balance / deducting from / adding to balance
const axios = require('axios');
var config = require('../cfg/config.json');

var unbelievaboatUrl = config.unbelievaboat.url;
var guildId = config.unbelievaboat.guildId;
var unbelievaboatAuthorization = config.unbelievaboat.auth;

async function getUserAmount(userID) {
    return await axios.get(unbelievaboatUrl + "/guilds/" + guildId + "/users/" + userID, {
            headers: {
                'Authorization': unbelievaboatAuthorization
            }
        })
        .then(function (response) {
            // handle success
            bank = response.data.bank;
            cash = response.data.cash;
        })
        .catch(function (error) {
            // handle error
            console.error("Error: " + error.message);
            return false;
        })
        .then(function () {
            // always executed
            return [bank, cash];
        }
    );
}

async function deductUserAmountCash(userID, price) {
    return await axios.patch(unbelievaboatUrl+ "/guilds/" + guildId + "/users/" + userID, 
    {
        cash: "-" + price,
        bank: "0"
    }, 
    {
        headers: {
            'Authorization': unbelievaboatAuthorization
        }
    })
    .then(function (response) {
        // console.log(response.data);
        return true;
    })
    .catch(function (error) {
        console.error("Error: " + error.message);
        return false;
    });
}
async function deductUserAmountBank(userID, price) {
    return await axios.patch(unbelievaboatUrl + "/guilds/" + guildId + "/users/" + userID, 
    {
        cash: "0",
        bank: "-" + price
    }, 
    {
        headers: {
            'Authorization': unbelievaboatAuthorization
        }
    })
    .then(function (response) {
        return true;
    })
    .catch(function (error) {
        console.error("Error: " + error.message);
        return false;
    });
}
async function addUserAmountBank(userID, amount) {
    return await axios.patch(unbelievaboatUrl + "/guilds/" + guildId + "/users/" + userID, 
    {
        cash: "0",
        bank: amount
    }, 
    {
        headers: {
            'Authorization': unbelievaboatAuthorization
        }
    })
    .then(function (response) {
        return true;
    })
    .catch(function (error) {
        console.error("Error: " + error.message);
        return false;
    });
}

module.exports = { getUserAmount, deductUserAmountCash, deductUserAmountBank, addUserAmountBank }