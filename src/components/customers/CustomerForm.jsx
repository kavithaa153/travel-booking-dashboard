import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import "./CustomerForm.css";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  country: "",
  image: "",
  status: "Active",
};

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const customers =
      JSON.parse(localStorage.getItem("travelgo_customers")) || [];

    const customer = customers.find(
      (item) => String(item.id) === String(id)
    );

    if (!customer) {
      setNotFound(true);
      return;
    }

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      country: customer.country || "",
      image: customer.image || "",
      status: customer.status || "Active",
    });
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Customer name is required";
      } else if (value.trim().length < 2) {
        error = "Name must contain at least 2 characters";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        error = "Enter a valid email address";
      }
    }

    if (name === "phone") {
      if (!value.trim()) {
        error = "Phone number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Phone number must contain 10 digits";
      }
    }

    if (name === "country" && !value.trim()) {
      error = "Country is required";
    }

    if (name === "status" && !value) {
      error = "Status is required";
    }

    if (name === "image" && value.trim()) {
      try {
        new URL(value);
      } catch {
        error = "Enter a valid image URL";
      }
    }

    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedValue =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));

    const error = validateField(name, updatedValue);

    setErrors((previous) => ({
      ...previous,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);

      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const customers =
      JSON.parse(localStorage.getItem("travelgo_customers")) || [];

    if (isEditMode) {
      const updatedCustomers = customers.map((customer) =>
        String(customer.id) === String(id)
          ? {
              ...customer,
              ...formData,
            }
          : customer
      );

      localStorage.setItem(
        "travelgo_customers",
        JSON.stringify(updatedCustomers)
      );
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "travelgo_customers",
        JSON.stringify([...customers, newCustomer])
      );
    }

    navigate("/customers");
  };

  if (notFound) {
    return (
      <div className="customer-form-page">
        <div className="customer-not-found">
          <h2>Customer Not Found</h2>
          <p>The customer you are looking for does not exist.</p>

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

  return (
    <div className="customer-form-page">
      <div className="customer-form-header">
        <button
          type="button"
          className="customer-back-button"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>

        <h1>
          {isEditMode ? "Edit Customer" : "Create Customer"}
        </h1>

        <p>
          {isEditMode
            ? "Update customer information."
            : "Add a new customer to TravelGo."}
        </p>
      </div>

      <form
        className="customer-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="customer-form-section">
          <div className="customer-section-title">
            <div className="customer-section-icon">
              <Image size={19} />
            </div>

            <div>
              <h2>Customer Information</h2>
              <p>Enter the customer's basic details.</p>
            </div>
          </div>

          <div className="customer-form-grid">
            <div className="customer-form-group">
              <label htmlFor="name">
                Full Name <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "customer-input-error" : ""}
              />

              {errors.name && (
                <small className="customer-error">
                  {errors.name}
                </small>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="email">
                Email <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "customer-input-error" : ""}
              />

              {errors.email && (
                <small className="customer-error">
                  {errors.email}
                </small>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="phone">
                Phone Number <span>*</span>
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                inputMode="numeric"
                placeholder="10 digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "customer-input-error" : ""}
              />

              {errors.phone && (
                <small className="customer-error">
                  {errors.phone}
                </small>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="country">
                Country <span>*</span>
              </label>

              <input
                id="country"
                name="country"
                type="text"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
                className={errors.country ? "customer-input-error" : ""}
              />

              {errors.country && (
                <small className="customer-error">
                  {errors.country}
                </small>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="status">
                Status <span>*</span>
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="customer-form-group">
              <label htmlFor="image">
                Profile Image URL
              </label>

              <input
                id="image"
                name="image"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                className={errors.image ? "customer-input-error" : ""}
              />

              {errors.image && (
                <small className="customer-error">
                  {errors.image}
                </small>
              )}

              {formData.image && !errors.image && (
                <div className="customer-image-preview">
                  <img
                    src={formData.image}
                    alt="Customer preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="customer-form-actions">
          <button
            type="button"
            className="customer-cancel-button"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="customer-save-button"
          >
            <Save size={18} />
            {isEditMode ? "Update Customer" : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
