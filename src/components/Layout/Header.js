import React from "react";
import { Search, Bell, Moon, Sun, ChevronDown } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Header() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search transactions or customers..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark Mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Business Owner</span>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
}
