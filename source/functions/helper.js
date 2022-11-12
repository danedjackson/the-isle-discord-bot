const checkRequestForSub = (requestedDinoName) => {

    if(requestedDinoName.toLowerCase().includes("sub")) {
        requestedDinoName = requestedDinoName.replace("sub", "").replaceAll(" ", "");
        requestedDinoName = `${requestedDinoName}subs`;
    }

    return requestedDinoName;

}

module.exports = { checkRequestForSub }