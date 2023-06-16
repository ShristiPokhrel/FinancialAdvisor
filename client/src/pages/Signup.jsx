import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";

import './style.css'


const Signup =() => {
  const navigate = useNavigate();
  
  const [ users, setUser ] = useState(
    {
      name:"",
      email:"",
      password:"",
      confirmPassword:""

    }  
      
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...users,
      [name]: value,
    });
  };

  // const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = users;
    if (name && email && password && password === confirmPassword) {
      await axios.post("http://localhost:8080/users/register", users).then((res) => {
        console.log(res.data)
        
      });
      toast.success("Register successfully");
      navigate('/signin');
     
      
    } else {
      //setLoading(false);
      
      toast.error("something went wrong");
    }
  };

  //prevent for login user
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     navigate("/");
  //   }
  // }, [navigate]);
    
    return (
    <>
      <div className="home">
     <div className="auth-wrapper ">
     
          <div className="auth-inner">
          {/* {loading && <Spinner />} */}
          <form onSubmit={submitHandler}  >
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>Name</label>
          <input
          id="name"
            type="text"
            className="form-control"
            placeholder="Name"   name="name" value={users.name} onChange={handleChange}
           required
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
          id="email"
            type="email"
            className="form-control"
            placeholder="Enter email"  name="email"  value={users.email} onChange={handleChange}
           required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
          id="password"
          type="password"
            className="form-control"
            placeholder="Enter password" required  name="password"  value={users.password} onChange={handleChange}
           
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input
          id="password"
          type="password"
            className="form-control"
            placeholder="Confirm password"  name="confirmPassword"  value={users.confirmPassword}
            onChange={handleChange}
           required
          />
        </div>

        <div className="d-grid">
          <button  type="submit" className="btn btn-primary" >
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/signin">Login</a>
        </p>
      </form>
    
            </div>
          </div>
          </div>

    </>
  )
}


export default Signup;
