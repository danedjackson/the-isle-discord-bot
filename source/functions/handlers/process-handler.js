const { growProcess } = require('../grow/growProcess');
const { injectProcess } = require('../inject/injectProcess');
var queue = require('../../globals/process-queue');

//First element of request is the type of process to be done. Route accordingly.
const processHandler = async (request) => {
    //TODO: Consider putting payment for processes here
    if(request[0] == "grow") return await growProcess(request);
    if(request[0] == "inject") return await injectProcess(request);
    //Removes request from queue after completion.
    console.log(`Completed processing [ ${queue.shift()} ]`);
    return; 
    
}

module.exports = { processHandler }