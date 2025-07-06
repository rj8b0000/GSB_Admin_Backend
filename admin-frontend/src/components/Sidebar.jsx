import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Stethoscope,
  ShoppingCart,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/payments", icon: CreditCard, label: "Payments" },
    { path: "/daily-updates", icon: Calendar, label: "Daily Updates" },
    { path: "/consultations", icon: Stethoscope, label: "Consultations" },
    { path: "/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/team", icon: UserCheck, label: "Team" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <h2>GSB</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li>
          <button
            onClick={handleLogout}
            className="menu-item"
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
