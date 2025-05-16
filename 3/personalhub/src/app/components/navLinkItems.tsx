import React from "react";
import Link from "next/link";

interface NavLinkItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  label,
  href,
  isActive = false,
}) => {
  return (
    <li className="nav-item">
      <Link
        href={href}
        className={`nav-link ${isActive ? "active" : ""}`}
        style={{
          textDecoration: isActive ? "underline" : "none",
          color: isActive ? "blue" : "black",
        }}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLinkItem;
