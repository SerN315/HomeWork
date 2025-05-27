import React from "react";
import dynamic from "next/dynamic";
import LoginForm from "@/app/components/ultis/LoginForm";
import RegisterForm from "@/app/components/ultis/RegisterForm";
import "@/app/styles/ultis/LoginForms.scss";
import "@/app/styles/pages/Login.scss";
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
