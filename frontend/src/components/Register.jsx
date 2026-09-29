import React, { useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const confirmPasswordRef = useRef();

  const matchConfirmPassword = () => {
    if (formData.password === confirmPasswordRef.current.value) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    if (matchConfirmPassword()) {
      const res = await axios.post(
        "https://chitchat-9dj6.onrender.com/user/signUp",
        {
          ...formData,
        },
      );

      res.data.user && navigate("/login");
    } else {
      alert("confirm password mismatch");
    }
  };

  return (
    <div className="login">
      <div className="logoDiv">
        <img className="logo" src="chat.png" alt="" />
        <h2>ChitChat</h2>
        <p>Join the secure conversation</p>
      </div>

      <form className="loginForm" onSubmit={handleUserRegister}>
        <h5>FULL NAME :</h5>
        <div className="inputDiv">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            placeholder="your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <h5>EMAIL ADDRESS :</h5>
        <div className="inputDiv">
          <i className="fa-regular fa-envelope"></i>
          <input
            type="email"
            placeholder="your@email.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <h5>PASSWORD :</h5>
        <div className="inputDiv">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* <i className="fa-regular fa-eye-slash"></i> */}
        </div>
        <h5>CONFIRM PASSWORD :</h5>
        <div className="inputDiv">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder="password"
            ref={confirmPasswordRef}
          />
        </div>

        <button type="submit">Create Account</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
