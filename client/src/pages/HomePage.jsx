import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Modal, Alert, Form, Table } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";

const HomePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  //table data
  const columns = [
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
      console.log("User Data " + user._id);
      // setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/transactions/${user._id}`
      );
      // setLoading(false);
      setAllTransaction(res.data);
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

  const handleSubmit1 = async (values) => {
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
      setAllTransaction((prevTransactions) => [
        ...prevTransactions,
        response.data,
      ]);
    } catch (error) {
      console.log(err);
      alert("error occuered");
      setSuccessMessage("Failed to add transaction");
    }
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
        <div>Range filters</div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTransaction.map((transaction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>
                  <button type="button" className="btn btn-info mx-2">
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger">
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
          <Form onSubmit={handleSubmit(handleSubmit1)}>
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
