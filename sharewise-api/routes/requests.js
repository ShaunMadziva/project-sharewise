const { Router } = require('express')
const requestController = require('../controllers/request')

requestRouter = Router()

requestRouter.get("/", requestController.index)
requestRouter.get("/:id", requestController.show)
requestRouter.post("/", requestController.create)
requestRouter.patch("/:id", requestController.update)
requestRouter.delete(":/id", requestController.destroy)

module.exports = requestController