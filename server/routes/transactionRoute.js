var express = require('express');
var router = express.Router();
const {
    getAllTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = require("../controllers/transactionController");

  //routes
  // Routes
router.get("/:userid", getAllTransactions);
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;