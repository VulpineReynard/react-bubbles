import React, { useState } from "react";
import axios from 'axios';

const Login = (props) => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChanges = e => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    })
    console.log(loginCredentials)
  }

  const login = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', loginCredentials)
      .then(res => {
        console.log(res);
        localStorage.setItem('token', res.data.payload);
        props.history.push('/protected');
      })
      .catch (err => {
        console.log(err);
      })
  }
  
  return (
    <div className="login-page">
      <h1>Welcome to the Bubble App!</h1>
      <form onSubmit={(e) => login(e)} className="login-form">
        <h2>Login</h2>
        <input 
        onChange={handleChanges}
        placeholder="Username"
        name="username"
        />
        <input 
        placeholder="Password"
        onChange={handleChanges}
        name="password"
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
