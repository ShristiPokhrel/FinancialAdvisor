const transactionModel = require("../models/transactionModel");
const moment = require("moment");

const getAllTransactions = async (req, res) => {
  try {
    console.log("called");
    const { frequency, type ,startDate,endDate} = req.query;
    const {  userid } = req.params;
console.log(startDate,endDate,"Date");
    let dateFilter = {};
    let typeFilter = {};

    console.log(frequency);
    if (frequency === "custom") {
      console.log(startDate);
      if(startDate.length>0){
console.log("start date called");
dateFilter={...dateFilter,$gte:new Date(startDate).toISOString()}
      }
      
      if(endDate)
      dateFilter = {
        ...dateFilter,
        $lte: moment(endDate).endOf("day").toDate(),
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
let  filterObj={userid}
console.log(dateFilter);
filterObj =Object.values(dateFilter).length>0?{userid,date:dateFilter}:filterObj
console.log(filterObj);
    const transactions = await transactionModel.find(filterObj);

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