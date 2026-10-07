import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Plane,
  Users,
  Ticket,
  CalendarDays,
  BarChart3,
  Settings
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Destinations",
    path: "/destinations",
    icon: MapPin
  },
  {
    label: "Trips",
    path: "/trips",
    icon: Plane
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users
  },
  {
    label: "Bookings",
    path: "/bookings",
    icon: Ticket
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings
  }
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>

      <div className="sidebar-logo">
        <div className="logo-icon">
          ✈
        </div>

        <div>
          <h2>TravelGo</h2>
          <span>Travel Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-promo">

        <div className="promo-image">
          <img
            src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=500&q=80"
            alt="Travel destination"
          />
        </div>

        <div className="promo-content">

          <h3>
            Explore New Destinations
          </h3>

          <Link
            to="/trips"
            className="promo-trips-button"
            onClick={onClose}
          >
            View Trips
            <span>→</span>
          </Link>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;