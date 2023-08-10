import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    message.success('Logged out successfully');
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Financial Advisor
        </Link>
        <div className="ml-auto">
          {loginUser && loginUser.name && (
            <p className="mb-0 mr-3">Welcome, {loginUser.name}</p>
          )}
          {loginUser && (
            <button className="btn btn-primary" onClick={logoutHandler}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
