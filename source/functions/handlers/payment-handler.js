
const { getUserAmount, deductUserAmountCash, deductUserAmountBank, addUserAmountBank } = require('../purchase');
var config = require('../../cfg/config.json');

const makePayment = async(price, userId) => {
    //check if the user has enough points
    var money = await getUserAmount(userId);
    var bank = parseInt(money[0]);
    var cash = parseInt(money[1]);
    price = parseInt(price);

    if (price > cash && price > bank) return false;

    if (cash >= parseInt(price)) {
        return await deductUserAmountCash(userId, price);
    }
    if (bank >= parseInt(price)) {
        return await deductUserAmountBank(userId, price);
    }
}

module.exports = { makePayment }