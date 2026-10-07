import { Mail, Phone, ShieldCheck, UserRound, Pencil } from "lucide-react";
import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page">

      <div className="profile-page-header">
        <div>
          <span>ACCOUNT MANAGEMENT</span>
          <h1>Admin Profile</h1>
          <p>Manage your TravelGo administrator profile.</p>
        </div>

        <button type="button" className="profile-edit-btn">
          <Pencil size={17} />
          Edit Profile
        </button>
      </div>

      <div className="profile-layout">

        <section className="profile-card profile-summary">

          <div className="profile-large-avatar">
            K
          </div>

          <h2>Kavitha</h2>
          <p className="profile-role">Administrator</p>

          <span className="profile-active-badge">
            <span></span>
            Active Account
          </span>

          <div className="profile-summary-divider"></div>

          <div className="profile-summary-item">
            <ShieldCheck size={17} />
            <div>
              <span>Role</span>
              <strong>Administrator</strong>
            </div>
          </div>

          <div className="profile-summary-item">
            <UserRound size={17} />
            <div>
              <span>Account Type</span>
              <strong>Admin Account</strong>
            </div>
          </div>

        </section>

        <section className="profile-card profile-details">

          <div className="profile-card-title">
            <div>
              <span>PERSONAL INFORMATION</span>
              <h2>Profile Information</h2>
            </div>
          </div>

          <div className="profile-details-grid">

            <div className="profile-detail-item">
              <label>Full Name</label>
              <div className="profile-detail-value">
                <UserRound size={17} />
                <span>Kavitha</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Email Address</label>
              <div className="profile-detail-value">
                <Mail size={17} />
                <span>admin@travelgo.com</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Phone Number</label>
              <div className="profile-detail-value">
                <Phone size={17} />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Account Role</label>
              <div className="profile-detail-value">
                <ShieldCheck size={17} />
                <span>Administrator</span>
              </div>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Profile;