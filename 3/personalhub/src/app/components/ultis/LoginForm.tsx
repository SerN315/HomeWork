"use client";
import React, { useState } from "react";
import LoginInput from "@/app/components/ui/loginInput";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebaseConfig";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({
    email: undefined,
    password: undefined,
    general: undefined,
  });

  const validateFields = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email.includes("@")) {
      newErrors.email = "Email must contain '@'";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validateFields()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User logged in:", userCredential.user);
      } catch (error: any) {
        console.error("Login error:", error.message);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Invalid email or password. Please try again.",
        }));
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful:", result.user);
    } catch (error: any) {
      console.error("Google login error:", error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "Failed to login with Google. Please try again.",
      }));
    }
  };

  const changeToRegister = () => {
    const formElement = document.getElementsByClassName("login-form");
    const registerElement = document.getElementsByClassName("register-form");
    if (formElement && registerElement) {
      formElement[0].classList.add("hidden");
      registerElement[0].classList.add("show");
    }
  };

  return (
    <div className="login-form">
      <h1 className="formName">Login</h1>
      <div className="titleDescription">
        <h1 className="title">Welcome Back</h1>
        <h2 className="subTitle">Let's login to begin productive</h2>
      </div>
      <form onSubmit={handleSubmit} id="login-form">
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
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {errors.general && <p className="error">{errors.general}</p>}
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
      <div className="interactionButton">
        <button type="submit" form="login-form">
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-login"
        >
          Login with Google
        </button>
      </div>
      <div className="register">
        <p>Don't have an account?</p>
        <a href="#" className="registerLink" onClick={changeToRegister}>
          Register
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
