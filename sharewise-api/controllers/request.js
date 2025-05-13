const Request = require('../models/Request')

async function index(req, res){
    try{
        const schoolId = req.params.id
        const request = await Request.getRequestsInfo(schoolId)
        res.status(200).json(request)
    }catch(err){
        res.status(500).json({error: err.message })
    }
}

async function show(req, res){
    const reqId = req.params.id
    try{
        const request = await Request.getRequestById(reqId)
        res.status(200).json(request)
    }catch(err){
        res.status(404).json({error: err.message})
    }
}

async function create(req, res){
    const data = req.body
    try{
        const request = await Request.postRequest(data)
        res.status(201).json(request)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

async function update(req, res){
    try{
        const reqId = req.params.id
        const data = req.body
        const request = await Request.getRequestById(reqId)
        const result = await request.postRequest(data)
        res.status(200).json(result)
    }catch(err){
        res.status(404).json({error: err.message})
    }
}


async function destroy(req, res){
    try{
        const reqId = req.params.id
        const request = await Request.getRequestById(reqId)
        const result = await request.destroy()
        res.status(204).end()
    }catch(err){
        res.status(404).json({error: err.message})
    }
}


module.exports = {
   index, show, create, update, destroy
}