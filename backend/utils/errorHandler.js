class ErrorHandler extends Error { //Error = error information ha uruvakka kudia class
    constructor(message, statusCode){ //to send this aruguments to parent class constructor Error
        super(message)//constructor of Error 
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor)//it give the stack property whenever the we give the object 
    }
}

module.exports = ErrorHandler;