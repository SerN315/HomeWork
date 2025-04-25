"use client";
import React, { useState } from "react";
import LoginInput from "@/app/components/loginInput";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({
    email: undefined,
    password: undefined,
  });

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    // if (!email.includes("@")) {
    //   newErrors.email = "Email must contain '@'";
    // }

    // if (password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateFields()) {
      console.log("Logging in with:", email, password);
    }
  };

  return (
    <div className="login-form">
      <h1 className="formName">Login</h1>
      <div className="titleDescription">
        <h1 className="title">Welcome Back</h1>
        <h2 className="subTitle">Lets login to begin productive</h2>
      </div>
      <form onSubmit={handleSubmit} id="login-form">
        <LoginInput
          type="email"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoginInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // error={errors.password}
        />
        <div className="subInteraction">
          <div className="rememberMe">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <a href="#" className="forgotPassword">
            Forgot Password?
          </a>
        </div>
      </form>
      <button type="submit" form="login-form">
        Login
      </button>
      <div className="register">
        <p>Don't have an account?</p>
        <a href="#" className="registerLink">
          Register
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
