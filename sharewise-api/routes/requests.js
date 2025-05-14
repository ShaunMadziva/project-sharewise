const { Router } = require("express");
const requestController = require("../controllers/request");

const requestRouter = Router();

requestRouter.get("/", requestController.getAllRequests);
requestRouter.get("/:id", requestController.getRequestById);
requestRouter.post("/", requestController.createNewRequest);
requestRouter.delete("/:id", requestController.deleteRequest);
requestRouter.patch("/:id/status", requestController.updateRequestStatus);

module.exports = requestRouter;
