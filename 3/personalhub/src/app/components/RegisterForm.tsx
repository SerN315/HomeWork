"use client";
import React, { useState } from "react";
import LoginInput from "@/app/components/loginInput";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/firebaseConfig";

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
    general?: string;
  }>({
    email: undefined,
    password: undefined,
    confirmpassword: undefined,
    notempty: undefined,
    general: undefined,
  });

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmpassword?: string;
      notempty?: string;
    } = {};

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (confirmpassword !== password) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    if (userName.trim().length < 1) {
      newErrors.notempty = "Username cannot be empty";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validateFields()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User registered:", userCredential.user);
        // Perform further actions, such as saving the username or redirecting
      } catch (error: any) {
        console.error("Registration error:", error.message);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to register. Please try again.",
        }));
      }
    }
  };
  const changeToLogin = () => {
    const formElement = document.getElementsByClassName("login-form");
    const registerElement = document.getElementsByClassName("register-form");
    if (formElement && registerElement) {
      formElement[0].classList.remove("hidden");
      registerElement[0].classList.remove("show");
    }
  };

  return (
    <div className="register-form">
      <h1 className="formName">Create your account</h1>
      <form onSubmit={handleSubmit} id="register-form">
        <p>Username</p>
        <LoginInput
          value={userName}
          label="Username"
          onChange={(e) => setUserName(e.target.value)}
          error={errors.notempty}
        />
        <p>Email</p>
        <LoginInput
          type="email"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <p>Password</p>
        <LoginInput
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <p>Confirm Password</p>
        <LoginInput
          type="password"
          label="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmpassword}
        />
        {errors.general && <p className="error">{errors.general}</p>}
      </form>
      <button type="submit" form="register-form">
        Register
      </button>
      <div className="register">
        <p>Already have an account</p>
        <a href="#" className="registerLink" onClick={changeToLogin}>
          Login
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;
