import {Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from "react-router-dom";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
 const route=createBrowserRouter(createRoutesFromElements( 
    <Route>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/signin" element={<Signin/>} />
  <Route path="/signup" element={<Signup/>} />
 </Route>));
  return (
    <>
  <RouterProvider router={route} />
    </>
  )
}
export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}


export default App
