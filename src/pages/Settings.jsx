import { useState } from "react";
import { Save, User, Bell, Shield, Globe } from "lucide-react";
import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    name: "Kavitha",
    email: "kavitha@gmail.com",
    role: "Admin",
    language: "English",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    bookingNotifications: true,
    paymentNotifications: true,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("travelgo_settings", JSON.stringify(settings));
    alert("Settings saved successfully");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your TravelGo account and application preferences.</p>
        </div>
      </div>

      <div className="settings-grid">

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Profile Information</h2>
              <p>Update your account details.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>Role</label>
              <input
                type="text"
                value={settings.role}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Globe size={20} />
            </div>

            <div>
              <h2>Preferences</h2>
              <p>Customize your application preferences.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Language</label>

              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Timezone</label>

              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >
                <option value="Asia/Kolkata">
                  Asia/Kolkata (IST)
                </option>

                <option value="UTC">
                  UTC
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Bell size={20} />
            </div>

            <div>
              <h2>Notifications</h2>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <div className="settings-options">

            <label className="settings-option">
              <div>
                <strong>Email Notifications</strong>
                <span>Receive important account notifications.</span>
              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
            </label>

            <label className="settings-option">
              <div>
                <strong>Booking Notifications</strong>
                <span>Get notified about new bookings.</span>
              </div>

              <input
                type="checkbox"
                name="bookingNotifications"
                checked={settings.bookingNotifications}
                onChange={handleChange}
              />
            </label>

            <label className="settings-option">
              <div>
                <strong>Payment Notifications</strong>
                <span>Receive payment status updates.</span>
              </div>

              <input
                type="checkbox"
                name="paymentNotifications"
                checked={settings.paymentNotifications}
                onChange={handleChange}
              />
            </label>

          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Shield size={20} />
            </div>

            <div>
              <h2>Security</h2>
              <p>Manage your account security.</p>
            </div>
          </div>

          <div className="security-info">
            <div>
              <strong>Password</strong>
              <span>Last updated recently</span>
            </div>

            <button className="secondary-settings-btn">
              Change Password
            </button>
          </div>
        </div>

      </div>

      <div className="settings-actions">
        <button
          className="save-settings-btn"
          onClick={handleSave}
        >
          <Save size={17} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;