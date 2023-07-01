import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import "./style.css";

const Signin = () => {
  const navigate = useNavigate();

  const [users, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...users,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = users;
    if (email && password) {
      try {
        const response = await axios.post("http://localhost:8080/users/login", users);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        message.success("Login successful");
        navigate("/");
      } catch (error) {
        message.error("Invalid email or password");
      }
    } else {
      message.error("Please enter email and password");
    }
  };

  return (
    <>
      <div className="home">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={submitHandler}>
              <h3>Sign In</h3>

              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <p className="forgot-password text-right">
                <a href="/signup">Not Registered?</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
