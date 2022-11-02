const { growProcess } = require('./grow/growProcess');
var queue = require('../globals/process-queue');

//First element of request is the type of process to be done. Route accordingly.
const processHandler = async (request) => {
    if(request[0] == "grow") return await growProcess(request);
    console.log(`Completed processing [ ${queue.shift()} ]`);
    return; 
    
}

module.exports = { processHandler }