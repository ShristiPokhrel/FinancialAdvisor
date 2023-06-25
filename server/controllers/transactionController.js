const transactionModel = require("../models/transactionModel");
const moment = require("moment");
const transaction = new transactionModel({
  // other fields
  date: new Date() // or provide a specific date value: new Date('2023-06-25')
});
const getAllTransactions = async (req, res) => {
  try {
    const { frequency, type } = req.query;
    const { selectedDate, userid } = req.params;

    let dateFilter = {};
    let typeFilter = {};

    if (frequency === "custom") {
      dateFilter = {
        $gte: moment(selectedDate[0]).startOf("day").toDate(),
        $lte: moment(selectedDate[1]).endOf("day").toDate(),
      };
    } else if (frequency === "7") {
      dateFilter = {
        $gte: moment().subtract(1, "week").startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      };
    } else if (frequency === "30") {
      dateFilter = {
        $gte: moment().subtract(1, "month").startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      };
    } else if (frequency === "365") {
      dateFilter = {
        $gte: moment().subtract(1, "year").startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      };
    }

    const transactions = await transactionModel.find({
      date: dateFilter,
      userid,
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await transactionModel.findByIdAndDelete(id);
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Use req.params instead of req.body to get the transaction ID from the URL path
    const payload = req.body; // No need to destructure payload from req.body

    const updatedTransaction = await transactionModel.findByIdAndUpdate(
      id,
      payload,
      { new: true } // Set the new option to true to return the updated document
    );
    

    if (!updatedTransaction) {
      return res.status(404).send("Transaction not found");
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransaction = async (req, res) => {
  try {
  const data=await transactionModel.create(req.body)
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
};