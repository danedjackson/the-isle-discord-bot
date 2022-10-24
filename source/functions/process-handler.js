var queue = require('../globals/process-queue');

const processHandler = (request) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);    
    }).then(() => {
        if(queue.length > 0) console.log(queue.shift());
        return; // do the promise call in a `then` callback to properly chain it
    })
}

module.exports = { processHandler }