"use client";
import React from "react";
import NavLinkItem from "./navLinkItems";
import "../styles/Nav.scss";
import Image from "next/image";

export const Nav: React.FC = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>
      <div className="nav-controller">
        <div className="nav-controller__search"></div>
      </div>
      <div className="nav-lists">
        <ul className="nav-list_menu">
          <h1 className="menu-title">Pages</h1>

          <NavLinkItem label="Home" href="/" isActive={false} />

          <NavLinkItem label="DashBoard" href="/dashboard" isActive={false} />

          <NavLinkItem label="Login" href="/auth" isActive={false} />
        </ul>
        <ul className="nav-list_widgetMenu">
          <h1 className="widget-title">Features</h1>

          <NavLinkItem label="Weather" href="/" isActive={false} />

          <NavLinkItem label="To-do" href="/dashboard" isActive={false} />

          <NavLinkItem label="Pomodoro" href="/auth/login" isActive={false} />

          <NavLinkItem label="Clock" href="/" isActive={false} />

          <NavLinkItem label="Sticky Notes" href="/" isActive={false} />

          <NavLinkItem label="Calendar" href="/" isActive={false} />
        </ul>
      </div>
      <div className="nav-user">
        <div className="user__container">
          <div className="user__image"></div>
          <div className="user__texts">
            <h2 className="userName">UserName</h2>
            <h3 className="email">Email@gmail.com</h3>
          </div>
          <div className="interactiveButtons"></div>
        </div>
      </div>
    </nav>
  );
};
