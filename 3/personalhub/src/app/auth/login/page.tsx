import React from "react";
import "@/app/styles/LoginForms.scss";
import "@/app/styles/Login.scss";
import LoginInternal from "./LoginInternal";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-page-content">
          <LoginInternal />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
