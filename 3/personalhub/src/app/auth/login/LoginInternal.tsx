import React from "react";
import dynamic from "next/dynamic";
import LoginForm from "@/app/components/LoginForm";
import RegisterForm from "@/app/components/RegisterForm";
import "@/app/styles/LoginForms.scss";
import "@/app/styles/Login.scss";
import Image from "next/image";

const LoginInternal: React.FC = () => {
  return (
    <div className="login-internal">
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

export default LoginInternal;
