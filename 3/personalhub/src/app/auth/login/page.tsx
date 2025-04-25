import React from "react";
import dynamic from "next/dynamic";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../../styles/LoginForms.scss";
import "../../styles/Login.scss";
import Image from "next/image";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <LoginForm />
      <RegisterForm />
      <div className="decorImage">
        <Image
          alt="The Storm"
          src="/604723-DmC-Devil-May-Cry-Vergil-4K.jpg"
          layout="fill"
          objectFit="cover"
        ></Image>
      </div>
    </div>
  );
};

export default LoginPage;
