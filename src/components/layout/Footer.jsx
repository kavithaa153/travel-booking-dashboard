import { Link } from "react-router-dom";
import {
  Plane,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="travel-footer">

      <div className="footer-top">

        <div className="footer-brand-section">

          <Link to="/" className="footer-brand">
            <div className="footer-logo">
              <Plane size={20} />
            </div>

            <div>
              <h3>TravelGo</h3>
              <span>Travel Management</span>
            </div>
          </Link>

          <p className="footer-description">
            Plan, manage and track every journey from one
            powerful travel management platform.
          </p>

          <div className="footer-status">
            <span className="status-dot"></span>
            All systems operational
          </div>

        </div>

        <div className="footer-column">

          <h4>Explore</h4>

          <Link to="/">
            Dashboard
          </Link>

          <Link to="/destinations">
            Destinations
          </Link>

          <Link to="/trips">
            Trips
          </Link>

          <Link to="/bookings">
            Bookings
          </Link>

        </div>

        <div className="footer-column">

          <h4>Management</h4>

          <Link to="/customers">
            Customers
          </Link>

          <Link to="/calendar">
            Calendar
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

          <Link to="/settings">
            Settings
          </Link>

        </div>

        <div className="footer-column footer-contact">

          <h4>Need Help?</h4>

          <div className="footer-contact-item">
            <Mail size={15} />
            <span>support@travelgo.com</span>
          </div>

          <div className="footer-contact-item">
            <Phone size={15} />
            <span>+91 98765 43210</span>
          </div>

          <div className="footer-contact-item">
            <MapPin size={15} />
            <span>India</span>
          </div>

        </div>

        <div className="footer-cta">

          <span className="footer-cta-label">
            READY TO EXPLORE?
          </span>

          <h4>
            Plan your next
            <span> journey.</span>
          </h4>

          <Link to="/trips" className="footer-cta-button">
            Explore Trips
            <ArrowUpRight size={16} />
          </Link>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © 2026 TravelGo. All rights reserved.
        </span>

        <div className="footer-bottom-links">
          <Link to="/profile">Admin Profile</Link>
          <Link to="/settings">Settings</Link>
          <span className="footer-version">v1.0.0</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;