const { processHandler } = require('./process-handler');
var queue = require('../globals/process-queue');

const queueHandler = async(request) => {
    queue.push(request);
    console.log(`Adding request to queue: ${request[0]} | ${request[1]} | ${request[2]} | ${request[3]}`);

    while (queue.length >= 1){
        //console.debug(`QUEUE: \n${queue}`);
        await processHandler(queue[0]);
    }
    return;
}

module.exports = { queueHandler }