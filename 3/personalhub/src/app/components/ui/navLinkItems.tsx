import React from "react";
import Link from "next/link";
import "@/app/styles/ui/NavLinkItem.scss"

interface NavLinkItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  id?: string;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  label,
  href,
  id,
  isActive = false,
}) => {
  return (
    <li className="nav-item" id={id}>
      <Link
        href={href}
        className={`nav-link ${isActive ? "active" : ""}`}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLinkItem;
