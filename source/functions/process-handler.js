var queue = require('../globals/process-queue');
const {  downloadFile, growEdit, uploadFile } = require('./ftp/ftp');

const processHandler = async (request) => {
    
    var response = await downloadFile(request[2]);
    console.log(response);
    response = await growEdit(request[0], request[2]);
    console.log(response);
    response = await uploadFile(request[2]);
    console.log(response);
    if(queue.length > 0) console.log(`completed processing [ ${queue.shift()} ]`);

    return; // do the promise call in a `then` callback to properly chain it
    
}



module.exports = { processHandler }