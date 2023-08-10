import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Modal, Alert, Form, Table } from "react-bootstrap";
import {UnorderedListOutlined, AreaChartOutlined} from '@ant-design/icons';
import axios from "axios";
import { useForm } from "react-hook-form";
import {format} from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import en from "date-fns/locale/en-US";
import Analytics from "../components/Analytics";
import { message } from "antd";
import BudgetSetting from "../components/BudgetSetting";
import BudgetAlertModal from "../components/BudgetAlertModal";

const changeArrayToMap=(arr)=>{
const arrayData=arr.map(elm=>([elm._id,elm]))
return new Map(arrayData)
}
const HomePage = () => {

  const [showModal, setShowModal] = useState(false);
  const [frequency,setFrequency] = useState();
  const [selectedDate, setSelectedate] = useState([null, null])
  const [allTransaction, setAllTransaction] = useState(new Map());
  const [successMessage, setSuccessMessage] = useState("");
   const [editable, setEditable] = useState({});
   const [type, setType] = useState('all')
  const { register, handleSubmit, reset,setValue } = useForm();
const formFileld=["description","amount","category","date","type"]
const [viewData, setViewData] = useState('table');
const [showBudgetSettingModal, setShowBudgetSettingModal] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState(0); // Initialize with 0
  const [budgetAlertVisible, setBudgetAlertVisible] = useState(false); // State for showing the alert

  // Function to handle budget limit submission
  const handleBudgetLimitSubmit = (limit) => {
    setBudgetLimit(limit);
    setShowBudgetSettingModal(false);
  };
  useEffect(() => {
    const totalExpenses = Array.from(allTransaction.values()).reduce((total, transaction) => {
      if (transaction.type === "expense") {
        return total + transaction.amount;
      }
      return total;
    }, 0);
    console.log("Total Expenses:", totalExpenses);
    console.log("Budget Limit:", budgetLimit);
  
  
    if (totalExpenses > budgetLimit) {
      console.log("Budget Exceeded");
      setBudgetAlertVisible(true);
    } else {
      console.log("Budget Not Exceeded");
      setBudgetAlertVisible(false);
    }
  }, [allTransaction, budgetLimit]);
  
  
 
useEffect(() => {
  for (const [key, value] of Object.entries(editable)) {
    if (key === "date") {
      setValue("date", value ? format(new Date(value), "yyyy-MM-dd") : "");
    }
    formFileld.includes(key) && setValue(key, value);
  }
}, [editable]);

const handleCustomFrequencyChange = (event) => {
  setFrequency(event.target.value);
  if (event.target.value === "custom") {
    setSelectedate([null, null]);
  }
}; 

  //table data
  const columns = [
   
      {
        title: "S.N.",
       
      },
    {
      title: "Date",
      dataIndex: "date",
      key: "date-key",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount-key",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type-key",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category-key",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description-key",
    },
    {
      title: "Actions",
      key: "actions-key",
    },
  ];

  //get all transaction
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let url = `http://localhost:8080/transactions/${user._id}`;
  
      let queryParams = { frequency, type: type !== 'all' ? type : undefined };
  
      if (frequency === "custom") {
        const [startDate, endDate] = selectedDate;
        queryParams = {
          ...queryParams,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
          frequency: "custom",
        };
      }
  
      const res = await axios.get(url, { params: queryParams });
      console.log("Fetched transactions:", res.data);
  
      setAllTransaction(changeArrayToMap(res.data));
  
      // Calculate total expenses from fetched transactions
      const totalExpenses = Array.from(res.data).reduce((total, transaction) => {
        if (transaction.type === "expense") {
          return total + transaction.amount;
        }
        return total;
      }, 0);
  
      console.log("Total Expenses:", totalExpenses);
  
      if (totalExpenses > budgetLimit) {
        setBudgetAlertVisible(true);
      } else {
        setBudgetAlertVisible(false);
      }
  
      setSuccessMessage("Successfully fetched transactions!");
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setSuccessMessage("Unable to fetch transactions");
    }
  };
  
  useEffect(() => {
    console.log("Frequency:", frequency);
    console.log("Selected Date:", selectedDate);
    console.log("Type:", type);
  
    getAllTransactions();
  }, [frequency, selectedDate, type]);
  
  
  const addData = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(values);
      const response = await axios.post("http://localhost:8080/transactions/", {
        ...values,
        userid: user._id,
      });
  
      // Update total expenses with the new transaction amount
      const totalExpenses = Array.from(allTransaction.values()).reduce((total, transaction) => {
        if (transaction.type === "expense") {
          return total + transaction.amount;
        }
        return total;
      }, 0) + parseFloat(values.amount);
  
      if (values.type === "expense" && totalExpenses > budgetLimit) {
        setBudgetAlertVisible(true);
      }
  
      console.log(response.data);
      message.success("Successfully added");
      
      setSuccessMessage("Successfully added");
      setShowModal(false);
      setAllTransaction((prevTransactions) => {
        prevTransactions.set(response.data._id, response.data);
        return prevTransactions;
      });
    } catch (error) {
      console.log(error);
      alert("error occurred");
      setSuccessMessage("Failed to add transaction");
    }
  };
  
  const edidData = async (data) => {
    try {
      const response = (await axios.put(`http://localhost:8080/transactions/${editable._id}`, data)).data;
      setSuccessMessage("Successfully edited");
      message.success("Successfully edited");
      setShowModal(false);
      setAllTransaction((prevTransactions) => {
        const updatedTransactions = new Map(prevTransactions);
        updatedTransactions.set(response._id, response);
        return updatedTransactions;
      });
    } catch (error) {
      console.log(error);
      message.error("An error occurred");
      setSuccessMessage("Failed to edit transaction");
    } finally {
      setEditable({});
    }
  };
  
  
  
  const handleDelete = async (id) => {
    const value = window.confirm("Are you want to delete this transaction");
    if(value){
    try {
      await axios.delete(`http://localhost:8080/transactions/${id}`);
      
      setAllTransaction((prevTransactions) =>
   {
    
if(prevTransactions.has(id)) prevTransactions.delete(id);

    return new Map(prevTransactions.entries())
   }
      );
      setSuccessMessage("Transaction deleted successfully");
      message.success("Transaction deleted successfully");
        // Call getAllTransactions to refresh the data after deletion
        await getAllTransactions();
    } catch (error) {
      console.log(error);
      message.error("Failed to delete transaction");
      setSuccessMessage("Failed to delete transaction");
    }
  } 

  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, "MM/dd/yyyy", { locale: en });
  };
  return (
    <Layout>
      {successMessage && (
        <div
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <img src="..." className="rounded mr-2" alt="..." />
            <strong className="mr-auto">{successMessage}</strong>
            <button
              type="button"
              className="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}

      <div className="filters">
      <div>
          <h6>
            Select Frequency
          </h6>
          <Form.Select
            value={frequency}
            onChange={handleCustomFrequencyChange}
          >
            <option value="7">Last 1 Week</option>
            <option value="30">Last 1 Month</option>
            <option value="365">Last 1 Year</option>
            <option value="custom">Custom</option>
          </Form.Select>
          {frequency === "custom" && (
  <div>
    <Form.Label>Custom Range</Form.Label>
    <div className="d-flex">
      <div className="mr-2">
        <Form.Label>Start Date</Form.Label>
        <DatePicker
          selected={selectedDate[0]}
          onChange={(date) => setSelectedate([date, selectedDate[1]])}
          className="form-control"
        />
      </div>
      <div>
        <Form.Label>End Date</Form.Label>
        <DatePicker
          selected={selectedDate[1]}
          onChange={(date) => setSelectedate([selectedDate[0], date])}
          className="form-control"
        />
      </div>
    </div>
    
  </div>
)}
</div>
        <div>
          <h6>
            Select Type
          </h6>
          <Form.Select
            value={type}
            onChange={(e)=> {
              console.log(e.target.value,"select");
              setType(e.target.value)}}
          >
            <option value="all">All</option>
            <option value="income">INCOME</option>
            <option value="expense">Expense</option>
            
          </Form.Select>
          {/* {frequency === "custom" && (
  <div>
    <Form.Label>Custom Range</Form.Label>
    <div className="d-flex">
      <div className="mr-2">
        <Form.Label>Start Date</Form.Label>
        <DatePicker
          selected={selectedDate[0]}
          onChange={(date) => setSelectedate([date, selectedDate[1]])}
          className="form-control"
        />
      </div>
      <div>
        <Form.Label>End Date</Form.Label>
        <DatePicker
          selected={selectedDate[1]}
          onChange={(date) => setSelectedate([selectedDate[0], date])}
          className="form-control"
        />
      </div>
    </div>
    
  </div>
)} */}
</div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowBudgetSettingModal(true)}>
            Set Budget Limit
          </button>
        </div>
        {/* Render the BudgetSetting modal */}
      <BudgetSetting
        showModal={showBudgetSettingModal}
        handleClose={() => setShowBudgetSettingModal(false)}
        handleBudgetLimitSubmit={handleBudgetLimitSubmit}
      />
      <BudgetAlertModal
      open={budgetAlertVisible}
      onClose={() => setBudgetAlertVisible(false)}
    />
       
        <div className="switch-icons">
<UnorderedListOutlined className={`mx-2 ${ viewData === 'table' ? 'active-icon': 'inactive-icon'}`}
onClick={() => setViewData('table')}/>
<AreaChartOutlined className={`mx-2 ${ viewData === 'analytics' ? 'active-icon': 'inactive-icon'}`} 
onClick={() => setViewData('analytics')}/>
</div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              reset();
              setEditable({});
              setShowModal(true)}}>
            Add New
          </button>
        </div>
      </div>
      <div> 
        { viewData === 'table' ? (
        <Table striped bordered hover className="min-90">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          
          {Array.from(allTransaction.values()).map((transaction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{transaction && transaction.date ? formatDate(transaction.date) : ""}</td>
                <td>Rs. {transaction.amount}</td>
                <td>{transaction.type}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>
                  <button type="button" className="btn btn-info mx-2" onClick={
                    ()=>{
                      setShowModal(true);
                      setEditable(transaction);
                    }
                  }>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" 
                  onClick={() => handleDelete(transaction._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> )
        : ( <Analytics allTransaction={allTransaction}/> 
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit((data)=>{
         
            Object.keys(editable).length===0?addData(data):edidData(data);
          })}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label name="amount">Enter your Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Add Amount"
                {...register("amount")}
              />
              <Form.Label name="type">Type</Form.Label>
              <Form.Control as="select" {...register("type")}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Control>
              <Form.Label name="category">Category</Form.Label>
              <Form.Control as="select" {...register("category")}>
                <option value="salary">Salary</option>
                <option value="shopping">Shopping</option>
                <option value="food">Food</option>
                <option value="rent">Rent</option>
                <option value="commission">Commission</option>
                <option value="fare">Fare</option>
                <option value="books">Books</option>
                <option value="fee">Fee</option>
                <option value="medicine">Medicine</option> 
                <option value="maintenance">Maintenance</option>
                <option value="bussiness">Bussiness</option>
                <option value="trade">Trade</option>
                <option value="fitness">Fitness</option>
                
              </Form.Control>
              <Form.Label name="date">Date</Form.Label>
              <Form.Control type="date" {...register("date")} />

              <Form.Label name="description">Description</Form.Label>
              <Form.Control type="text" {...register("description")} />

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  SAVE
                </button>{" "}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default HomePage;