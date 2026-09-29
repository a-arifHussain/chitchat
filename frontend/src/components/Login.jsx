import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);

  const [formData, setFromData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFromData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    try {
      const res = await axios.post(
        "https://chitchat-9dj6.onrender.com/user/login",
        {
          ...formData,
        },
        {
          withCredentials: true,
        },
      );

      setUser(res.data);
      res.data?._id && navigate("/");
    } catch (err) {
      console.log(err, "from catch login");
    }
  };

  return (
    <div className="login">
      <div className="logoDiv">
        <img className="logo" src="chat.png" alt="" />
        <h2>ChitChat</h2>
        <p>Welcome back. Please login your account</p>
      </div>

      <form className="loginForm" onSubmit={handleUserLogin}>
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
        </div>

        <button type="submit">
          Login <i className="fa-solid fa-right-long"></i>
        </button>
        <p>
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
