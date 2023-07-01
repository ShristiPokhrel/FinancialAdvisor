import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

import "./style.css";

const Signup = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers({
      ...users,
      [name]: value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = users;

    if (name && email && password && password === confirmPassword) {
      try {
        await axios.post("http://localhost:8080/users/register", users);
        message.success("Registered successfully");
        navigate("/signin"); // Redirect to signin page
      } catch (error) {
        message.error("Something went wrong");
      }
    } else {
      message.error("Please fill all fields and make sure passwords matchs");
    }
  };

  return (
    <div className="home">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={submitHandler}>
            <h3>Sign Up</h3>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                value={users.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={users.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={users.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                name="confirmPassword"
                value={users.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p className="forgot-password text-right">
              Already Registered? <a href="/signin">Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
