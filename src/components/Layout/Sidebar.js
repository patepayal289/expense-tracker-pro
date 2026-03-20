import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, Wallet, HelpCircle } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Wallet size={24} color="#fff" />
        </div>
        <h2 className="brand-name">KhataPro</h2>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} className="menu-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Users size={20} className="menu-icon" />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/cashbook" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Wallet size={20} className="menu-icon" />
          <span>Cashbook</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} className="menu-icon" />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <button className="help-btn">
          <HelpCircle size={20} className="menu-icon" />
          <span>Help & Support</span>
        </button>
      </div>
    </div>
  );
}
