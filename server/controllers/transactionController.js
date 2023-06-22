const transactionModel = require("../models/transactionModel");
const moment = require("moment");

const getAllTransactions = async (req, res) => {
  try {
    // const { frequency, selectedDate, type, userid } = req.query;
    // let query = { userid };

    // if (frequency !== "custom") {
    //   query.date = {
    //     $gt: moment().subtract(Number(frequency), "d").toDate(),
    //   };
    // } else {
    //   query.date = {
    //     $gte: selectedDate[0],
    //     $lte: selectedDate[1],
    //   };
    // }

    // if (type !== "all") {
    //   query.type = type;
    // }

    const transactions = await transactionModel.find({
      userid:req.params.userid
    });
    console.log(req.params.userid);
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