
const { getUserAmount, deductUserAmountCash, deductUserAmountBank, addUserAmountBank } = require('../api/unbelievaboat-api');
var config = require('../../cfg/config.json');

const checkBalance = async(price, userId) => {
    if(parseInt(price) == 0) return true;

    //check if the user has enough points
    var money = await getUserAmount(userId);
    var bank = parseInt(money[0]);
    var cash = parseInt(money[1]);
    price = parseInt(price);

    if (price > cash && price > bank) return false;

    return true;
}

const makePayment = async(price, userId) => {
    if(parseInt(price) == 0) return true;

    if (cash >= parseInt(price)) {
        return await deductUserAmountCash(userId, price);
    }
    if (bank >= parseInt(price)) {
        return await deductUserAmountBank(userId, price);
    }
}

module.exports = {checkBalance, makePayment }