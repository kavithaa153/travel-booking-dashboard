import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Save
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import "./CustomerForm.css";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  country: "",
  image: "",
  status: "Active"
};

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("travelgo_customers")
        ) || [];

      const customer = savedCustomers.find(
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
        status: customer.status || "Active"
      });
    } catch (error) {
      showToast(
        "Unable to load customer.",
        "error"
      );
    }
  }, [id, isEditMode, showToast]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Customer name is required";
      } else if (value.trim().length < 3) {
        error = "Name must be at least 3 characters";
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
      } else if (!/^[0-9]{10}$/.test(value)) {
        error = "Phone number must contain 10 digits";
      }
    }

    if (name === "country") {
      if (!value.trim()) {
        error = "Country is required";
      } else if (value.trim().length < 2) {
        error = "Enter a valid country";
      }
    }

    if (name === "image" && value.trim()) {
      const validUrl =
        value.startsWith("http://") ||
        value.startsWith("https://");

      if (!validUrl) {
        error = "Enter a valid image URL";
      }
    }

    if (name === "status" && !value) {
      error = "Status is required";
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field,
        formData[field]
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedData);

    const error = validateField(name, value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: error
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showToast(
        "Please fix the highlighted fields.",
        "error"
      );
      return;
    }

    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("travelgo_customers")
        ) || [];

      if (isEditMode) {
        const customerExists = savedCustomers.some(
          (customer) =>
            String(customer.id) === String(id)
        );

        if (!customerExists) {
          showToast(
            "Customer could not be found.",
            "error"
          );
          return;
        }

        const updatedCustomers =
          savedCustomers.map((customer) =>
            String(customer.id) === String(id)
              ? {
                  ...customer,
                  ...formData
                }
              : customer
          );

        localStorage.setItem(
          "travelgo_customers",
          JSON.stringify(updatedCustomers)
        );

        showToast(
          "Customer updated successfully",
          "success"
        );
      } else {
        const newCustomer = {
          id: Date.now(),
          ...formData
        };

        const updatedCustomers = [
          ...savedCustomers,
          newCustomer
        ];

        localStorage.setItem(
          "travelgo_customers",
          JSON.stringify(updatedCustomers)
        );

        showToast(
          "Customer created successfully",
          "success"
        );
      }

      setTimeout(() => {
        navigate("/customers");
      }, 500);
    } catch (error) {
      showToast(
        isEditMode
          ? "Unable to update customer."
          : "Unable to create customer.",
        "error"
      );
    }
  };

  if (notFound) {
    return (
      <div className="customer-form-page">
        <div className="customer-not-found">
          <div className="customer-not-found-icon">
            <UserRound size={28} />
          </div>

          <h2>Customer Not Found</h2>

          <p>
            The customer you are looking for does not exist.
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

        <div>
          <h1>
            {isEditMode
              ? "Edit Customer"
              : "Create Customer"}
          </h1>

          <p>
            {isEditMode
              ? "Update customer information."
              : "Add a new customer to TravelGo."}
          </p>
        </div>
      </div>

      <form
        className="customer-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="customer-form-section">
          <div className="customer-form-section-title">
            <div className="customer-form-section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Customer Information</h2>

              <p>
                Enter the customer's contact and profile details.
              </p>
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
                placeholder="Example: John Smith"
                value={formData.name}
                onChange={handleChange}
                className={
                  errors.name
                    ? "customer-input-error"
                    : ""
                }
              />

              {errors.name && (
                <small className="customer-error">
                  {errors.name}
                </small>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="email">
                Email Address <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={
                  errors.email
                    ? "customer-input-error"
                    : ""
                }
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
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  handleChange({
                    target: {
                      name: "phone",
                      value
                    }
                  });
                }}
                className={
                  errors.phone
                    ? "customer-input-error"
                    : ""
                }
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
                placeholder="Example: India"
                value={formData.country}
                onChange={handleChange}
                className={
                  errors.country
                    ? "customer-input-error"
                    : ""
                }
              />

              {errors.country && (
                <small className="customer-error">
                  {errors.country}
                </small>
              )}
            </div>

            <div className="customer-form-group full-width">
              <label htmlFor="image">
                Profile Image URL
                <span className="customer-optional">
                  Optional
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/profile.jpg"
                value={formData.image}
                onChange={handleChange}
                className={
                  errors.image
                    ? "customer-input-error"
                    : ""
                }
              />

              {errors.image && (
                <small className="customer-error">
                  {errors.image}
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
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              {errors.status && (
                <small className="customer-error">
                  {errors.status}
                </small>
              )}
            </div>
          </div>
        </div>

        {formData.image && !errors.image && (
          <div className="customer-image-preview">
            <h3>Profile Preview</h3>

            <img
              src={formData.image}
              alt="Customer preview"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

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

            {isEditMode
              ? "Update Customer"
              : "Save Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;