import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Modal, Alert, Form, Table } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import {format} from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import en from "date-fns/locale/en-US";

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
  
      if (frequency === "custom") {
        const [startDate, endDate] = selectedDate;
        const queryParams = {
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
          type: type !== 'all' ? type : undefined,
        };
        const res = await axios.get(url, { params: queryParams });
        setAllTransaction(res.data);
      } else {
        const queryParams = { frequency, type: type !== 'all' ? type : undefined }; // Add type as a query parameter if it's not 'all'
        const res = await axios.get(url, { params: queryParams });
        setAllTransaction(res.data);
      }
  
      setSuccessMessage("Successfully fetched transactions!");
    } catch (error) {
      console.log(error);
      setSuccessMessage("Unable to fetch transactions");
    }
  };
  
  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);
  

  const  addData = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // setLoading(true)
      console.log(values);
      const response = await axios.post("http://localhost:8080/transactions/", {
        ...values,
        userid: user._id,
      });
      console.log(response.data);
      // setLoading(false)
      setSuccessMessage("Successfully added");
      setShowModal(false);
      setAllTransaction((prevTransactions) =>{
        prevTransactions.set(response.data._id,response.data)
        return prevTransactions;
      });


    } catch (error) {
      console.log(err);
      alert("error occuered");
      setSuccessMessage("Failed to add transaction");
    }
  };
  const edidData = async (data) => {
    try {
      const response = (await axios.put(`http://localhost:8080/transactions/${editable._id}`, data)).data;
      setSuccessMessage("Successfully edited");
      setShowModal(false);
      setAllTransaction((prevTransactions) => {
        const updatedTransactions = new Map(prevTransactions);
        updatedTransactions.set(response._id, response);
        return updatedTransactions;
      });
    } catch (error) {
      console.log(error);
      alert("An error occurred");
      setSuccessMessage("Failed to edit transaction");
    } finally {
      setEditable({});
    }
  };
  
  const handleDelete = async (id) => {
    const value = confirm("Are you want to delete this product");
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
    } catch (error) {
      console.log(error);
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
            value={frequency}
            onChange={(values)=> setType(values)}
          >
            <option value="all">All</option>
            <option value="income">INCOME</option>
            <option value="expense">Expense</option>
            
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
          <button
            className="btn btn-primary"
            onClick={() => {
              reset();
              setEditable({});
              setShowModal(true)}}
          >
            Add New
          </button>
        </div>
      </div>
      <div>
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
                <td>{transaction.date ? formatDate(transaction.date) : ""}</td>
                <td>{transaction.amount}</td>
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
        </Table>
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
