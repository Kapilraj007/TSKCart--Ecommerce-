module.exports = func=>(req,res,next)=> //func parameter is pin to aysnc
 Promise.resolve(func(req,res,next)).catch(next)
