const { Router } = require("express");
const requestController = require("../controllers/request");
const authenticateToken = require("../middleware/authmiddleware");
const requestRouter = Router();

requestRouter.get("/", requestController.getAllRequests);
requestRouter.get("/school/:schoolId", requestController.getRequestsBySchoolId);
requestRouter.get("/school/:schoolId/processed",requestController.processSchoolData);
requestRouter.get("/:id", requestController.getRequestById);
requestRouter.post("/", authenticateToken, requestController.createNewRequest);
requestRouter.delete("/:id", requestController.deleteRequest);
requestRouter.patch("/:id/status", requestController.updateRequestStatus);

module.exports = requestRouter;
