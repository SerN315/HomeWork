"use client";
import React from "react";
import NavLinkItem from "../ui/navLinkItems";
import "@/app/styles/layouts/Nav.scss";
import Image from "next/image";

export const Nav: React.FC = () => {
  return (
    <nav className="nav">
      <div className="topHalf">
        <div className="nav-user">
        <div className="user__container">
          <div className="userInfo">
          <div className="user__image"
          style={{ backgroundImage: "url('/motivation.jpg')" }}>
          </div>
          <div className="user__texts">
            <h2 className="userName">UserName</h2>
            <h3 className="email">Email@gmail.com</h3>
          </div>
          </div>
          <div className="interactiveButtons">V</div>
        </div>
      </div>
      <div className="nav-controller">
        <div className="nav-controller__search"></div>
      </div>
      <div className="nav-lists">
        <ul className="nav-list_menu">
          <h1 className="menu-title">PAGES</h1>

          <NavLinkItem label="Home" href="/" isActive={false} />

          <NavLinkItem label="DashBoard" href="/dashboard" isActive={false} />

          <NavLinkItem label="Login" href="/auth" isActive={false} />
        </ul>
        <ul className="nav-list_widgetMenu">
          <h1 className="menu-title">FEATURES</h1>

          <NavLinkItem label="Weather" href="/" isActive={false} />

          <NavLinkItem label="To-do" href="/dashboard" isActive={false} />

          <NavLinkItem label="Pomodoro" href="/auth/login" isActive={false} />

          <NavLinkItem label="Clock" href="/" isActive={false} />

          <NavLinkItem label="Sticky Notes" href="/" isActive={false} />

          <NavLinkItem label="Calendar" href="/" isActive={false} />
        </ul>
      </div>
      </div>
      <div className="quickOptions">
        <NavLinkItem label="Settings" href="/" isActive={false} id="settingButton" />
        <NavLinkItem label="Logout" href="/" isActive={false} id="logoutButton" />
      </div>
    </nav>
  );
};
