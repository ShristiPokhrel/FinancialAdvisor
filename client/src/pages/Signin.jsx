import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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

  // const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = users;
    if (email && password) {
     const result= await axios
        .post("http://localhost:8080/users/login", users)
        localStorage.setItem('token',result.data.token)
        localStorage.setItem('user',JSON.stringify(result.data.user))
      toast.success("Login successfully");
      navigate("/");
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
        <div className="auth-wrapper">
          <div className="auth-inner">
            {/* {loading && <Spinner />} */}
            {console.log(users)}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
              <p className="forgot-password text-right">
                Already<a href="/signup">Registered?</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
