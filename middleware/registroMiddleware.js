function registroMiddleware(req, res, next){
    const fecha = new Date().toISOString()
    console.log(`[Historia]: ${fecha}, ${req.method}, ${req.url}, ${req.ip}`)
    next()
}

module.exports = registroMiddleware

