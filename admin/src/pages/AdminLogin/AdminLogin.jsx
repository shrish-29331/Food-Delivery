import React, { useContext, useState } from "react";
import { AdminContext } from "../../components/Context/adminContext";

import './AdminLogin.css'
import axios from "axios";

const AdminLogin = ({ url }) => {
  const { saveToken } = useContext(AdminContext);
  const [isSignup, setIsSignup] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/admin/register" : "/api/admin/login";
    try {
      const res = await axios.post(`${url}${endpoint}`, data);
      if (res.data.success) {
        saveToken(res.data.token); // Use correct function and variable
        window.location.reload();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };


  return (
    
    <form onSubmit={handleSubmit} className="admin-login-form">
      // At the top of the return() block
<a href="https://foogroo-delivery.vercel.app/" className="back-to-main">
  ← Back to Main Site
</a>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      {isSignup && (
        <input
          name="name"
          placeholder="Name"
          value={data.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={data.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{isSignup ? "Create Account" : "Login"}</button>
      
      <p onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "No account? Sign Up"}
      </p>
    </form>
  );
};

export default AdminLogin;
