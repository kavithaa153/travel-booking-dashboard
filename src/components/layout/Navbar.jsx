import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut
} from "lucide-react";

import "./Navbar.css";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchTerm.trim().toLowerCase();

    if (!value) {
      return;
    }

    if (value.includes("trip") || value.includes("travel")) {
      navigate("/trips");
    } else if (
      value.includes("customer") ||
      value.includes("user")
    ) {
      navigate("/customers");
    } else if (
      value.includes("destination") ||
      value.includes("place")
    ) {
      navigate("/destinations");
    } else if (
      value.includes("booking") ||
      value.includes("reservation")
    ) {
      navigate("/bookings");
    } else if (value.includes("calendar")) {
      navigate("/calendar");
    } else if (
      value.includes("analytics") ||
      value.includes("report")
    ) {
      navigate("/analytics");
    } else if (value.includes("setting")) {
      navigate("/settings");
    } else {
      navigate("/trips");
    }

    setSearchTerm("");
  };

  const handleProfileClick = () => {
    setProfileOpen((previous) => !previous);
  };

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const handleSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">

      <button
        type="button"
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <form
        className="navbar-search"
        onSubmit={handleSearch}
      >
        <Search size={19} />

        <input
          type="text"
          placeholder="Search trips, customers, destinations..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </form>

      <div className="navbar-actions">

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-wrapper">

          <button
            type="button"
            className="profile"
            onClick={handleProfileClick}
            aria-expanded={profileOpen}
          >
            <div className="profile-avatar">
              K
            </div>

            <div className="profile-info">
              <strong>Kavitha</strong>
              <span>Admin</span>
            </div>

            <ChevronDown
              size={17}
              className={
                profileOpen
                  ? "profile-chevron open"
                  : "profile-chevron"
              }
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              <button
                type="button"
                onClick={handleProfile}
              >
                <User size={16} />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={handleSettings}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <div className="profile-dropdown-divider"></div>

              <button
                type="button"
                className="logout-option"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;