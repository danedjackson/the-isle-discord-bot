const { processHandler } = require('./process-handler');
var queue = require('../globals/process-queue');

const queueHandler = async(request) => {
    queue.push(request);
    console.log(`Adding request to queue: ${request}`);

    while (queue.length >= 1){
        console.debug(queue);
        await processHandler(queue[0]);
    }
    return;
}

module.exports = { queueHandler }