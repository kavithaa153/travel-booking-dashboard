import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  UserRound,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "./CustomerDetails.css";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomers =
      JSON.parse(
        localStorage.getItem("travelgo_customers")
      ) || [];

    const selectedCustomer = savedCustomers.find(
      (item) => String(item.id) === String(id)
    );

    setCustomer(selectedCustomer || null);
  }, [id]);

  if (!customer) {
    return (
      <div className="customer-details-page">
        <div className="customer-details-not-found">
          <div className="customer-not-found-icon">
            <UserRound size={28} />
          </div>

          <h2>Customer Not Found</h2>

          <p>
            The customer you are looking for does not exist
            or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const isActive = customer.status === "Active";

  return (
    <div className="customer-details-page">

      <div className="customer-details-header">

        <button
          type="button"
          className="customer-details-back"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>

        <button
          type="button"
          className="customer-details-edit"
          onClick={() =>
            navigate(`/customers/${customer.id}/edit`)
          }
        >
          <Pencil size={17} />
          Edit Customer
        </button>

      </div>

      <div className="customer-details-card">

        <div className="customer-profile-section">

          <div className="customer-large-avatar">

            {customer.image ? (
              <img
                src={customer.image}
                alt={customer.name}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling.style.display =
                    "flex";
                }}
              />
            ) : null}

            <div
              className="customer-avatar-placeholder"
              style={{
                display: customer.image
                  ? "none"
                  : "flex",
              }}
            >
              <UserRound size={42} />
            </div>

          </div>

          <div className="customer-profile-info">

            <span className="customer-profile-label">
              CUSTOMER PROFILE
            </span>

            <h1>{customer.name}</h1>

            <div className="customer-profile-email">
              <Mail size={16} />
              {customer.email}
            </div>

            <span
              className={`customer-details-status ${
                customer.status?.toLowerCase()
              }`}
            >
              {isActive ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}

              {customer.status}
            </span>

          </div>

        </div>

        <div className="customer-information">

          <h2>Contact Information</h2>

          <div className="customer-info-grid">

            <div className="customer-info-box">

              <div className="customer-info-icon">
                <UserRound size={19} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{customer.name}</strong>
              </div>

            </div>

            <div className="customer-info-box">

              <div className="customer-info-icon">
                <Mail size={19} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{customer.email}</strong>
              </div>

            </div>

            <div className="customer-info-box">

              <div className="customer-info-icon">
                <Phone size={19} />
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{customer.phone}</strong>
              </div>

            </div>

            <div className="customer-info-box">

              <div className="customer-info-icon">
                <Globe size={19} />
              </div>

              <div>
                <span>Country</span>
                <strong>
                  {customer.country || "-"}
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className="customer-details-actions">

          <button
            type="button"
            className="customer-details-secondary"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            type="button"
            className="customer-details-primary"
            onClick={() =>
              navigate(`/customers/${customer.id}/edit`)
            }
          >
            <Pencil size={17} />
            Edit Customer
          </button>

        </div>

      </div>

    </div>
  );
}

export default CustomerDetails;