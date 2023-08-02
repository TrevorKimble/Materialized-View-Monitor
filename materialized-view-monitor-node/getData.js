const router = require(`express`).Router()
const planningController = require(`./getDataController.js`)

router.get(`/cyclesMissed`, planningController.getStatus)

router.get(`/sendMaterializedViewAlerts`, planningController.sendMaterializedViewAlerts)

module.exports = router