import React from 'react'
import {Link} from "react-router-dom";
const Header = () => {
  return (
    <>
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon" />
  </button>
  <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
    <Link className="navbar-brand" to="/">Financial Advisor</Link>
    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
      <li className="nav-item">
        <Link className="nav-link active" to="/user" aria-current="page">USER <span className="sr-only">(current)</span></Link>
      </li>
      
    </ul>
   
  </div>
</nav>
      
    </div>
    </>
  )
}

export default Header
