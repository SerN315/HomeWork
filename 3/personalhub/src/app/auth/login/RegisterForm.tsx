"use client";
import React, { useState } from "react";
import LoginInput from "@/app/components/loginInput";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmpassword?: string;
    notempty?: string;
  }>({
    email: undefined,
    password: undefined,
    confirmpassword: undefined,
    notempty: undefined,
  });

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmpassword?: string;
      notempty?: string;
    } = {};

    // Validate password
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (confirmpassword !== password) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    // Validate username
    if (userName.trim().length < 1) {
      newErrors.notempty = "Username cannot be empty";
    }

    // Update all errors at once
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateFields()) {
      console.log("Registering in with:", email, password);
    }
  };

  return (
    <div className="register-form">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <LoginInput
          value={userName}
          label="Username"
          onChange={(e) => setUserName(e.target.value)}
          error={errors.notempty}
        />
        <LoginInput
          type="email"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          //   error={errors.email}
        />
        <LoginInput
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <LoginInput
          type="password"
          label="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmpassword}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
