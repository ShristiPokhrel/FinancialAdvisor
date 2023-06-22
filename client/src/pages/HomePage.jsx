import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Modal, Alert, Form, Table } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import {format} from "date-fns"
const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState(new Map());
  const [successMessage, setSuccessMessage] = useState("");
   const [editable, setEditable] = useState({});
  const { register, handleSubmit, reset,setValue } = useForm();
const formFileld=["description","amount","category","date","type"]

useEffect(()=>{
for (const [key,value] of Object.entries(editable)) {
  if(key==="date"){
    // setValue("date",format(value,'MM/dd/yyyy'))
  }
  formFileld.includes(key)&& setValue(key,value)
}
},[editable])


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
  
      // setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/transactions/${user._id}`
      );
     const result= res.data.map(trns=>[trns._id,trns])
      setAllTransaction(new Map(result));
      // console.log(res.data);
      setSuccessMessage("Successfully added!");
    } catch (error) {
      console.log(error);
      setSuccessMessage("Unable to fetch");
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

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
  const edidData=async(data)=>{
    try {
      const response = (await axios.put(`http://localhost:8080/transactions/${editable._id}`, data)).data;
      setSuccessMessage("Successfully edited");

      setShowModal(false);
      console.log(response);
      setAllTransaction(prev=>{
       prev.set(response._id,response)
        return prev;
      })

    } catch (error) {
      console.log(err);
      alert("error occuered");
      setSuccessMessage("Failed to add transaction");
    }
    finally{
      setEditable({});
    }
  }
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
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString().replace(/\//g, "-");
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
        <div>Range filters</div>
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
                <td>{formatDate(transaction.date)}</td>
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
