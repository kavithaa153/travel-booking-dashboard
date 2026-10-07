import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import "./DestinationForm.css";

const initialFormData = {
  name: "",
  country: "",
  description: "",
  image: "",
  status: "Active",
};

function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const savedDestinations =
      JSON.parse(
        localStorage.getItem("travelgo_destinations")
      ) || [];

    const destination = savedDestinations.find(
      (item) => String(item.id) === String(id)
    );

    if (!destination) {
      setNotFound(true);
      return;
    }

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      description: destination.description || "",
      image: destination.image || "",
      status: destination.status || "Active",
    });
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Destination name is required";
      } else if (value.trim().length < 2) {
        error = "Destination name must be at least 2 characters";
      }
    }

    if (name === "country") {
      if (!value.trim()) {
        error = "Country is required";
      } else if (value.trim().length < 2) {
        error = "Country must be at least 2 characters";
      }
    }

    if (name === "description") {
      if (!value.trim()) {
        error = "Description is required";
      } else if (value.trim().length < 10) {
        error = "Description must be at least 10 characters";
      }
    }

    if (name === "image" && value.trim()) {
      const isValidImageUrl =
        value.startsWith("http://") ||
        value.startsWith("https://");

      if (!isValidImageUrl) {
        error = "Enter a valid image URL";
      }
    }

    if (name === "status") {
      if (!value) {
        error = "Status is required";
      }
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
      [name]: value,
    };

    setFormData(updatedData);

    const error = validateField(name, value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: error,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const savedDestinations =
      JSON.parse(
        localStorage.getItem("travelgo_destinations")
      ) || [];

    if (isEditMode) {
      const updatedDestinations =
        savedDestinations.map((destination) =>
          String(destination.id) === String(id)
            ? {
                ...destination,
                ...formData,
              }
            : destination
        );

      localStorage.setItem(
        "travelgo_destinations",
        JSON.stringify(updatedDestinations)
      );
    } else {
      const newDestination = {
        id: Date.now(),
        ...formData,
      };

      const updatedDestinations = [
        ...savedDestinations,
        newDestination,
      ];

      localStorage.setItem(
        "travelgo_destinations",
        JSON.stringify(updatedDestinations)
      );
    }

    navigate("/destinations");
  };

  if (notFound) {
    return (
      <div className="destination-form-page">
        <div className="destination-not-found">
          <h2>Destination Not Found</h2>
          <p>
            The destination you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/destinations")}
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-form-page">

      <div className="destination-form-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/destinations")}
        >
          <ArrowLeft size={18} />
          Back to Destinations
        </button>

        <div>
          <h1>
            {isEditMode
              ? "Edit Destination"
              : "Create Destination"}
          </h1>

          <p>
            {isEditMode
              ? "Update destination information."
              : "Add a new destination to TravelGo."}
          </p>
        </div>

      </div>

      <form
        className="destination-form-card"
        onSubmit={handleSubmit}
        noValidate
      >

        <div className="form-section">

          <div className="form-section-title">
            <div className="form-section-icon">
              <Image size={19} />
            </div>

            <div>
              <h2>Destination Information</h2>
              <p>
                Enter the basic details for this destination.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">

              <label htmlFor="name">
                Destination Name
                <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Example: Paris"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />

              {errors.name && (
                <small className="error-message">
                  {errors.name}
                </small>
              )}

            </div>

            <div className="form-group">

              <label htmlFor="country">
                Country
                <span>*</span>
              </label>

              <input
                id="country"
                name="country"
                type="text"
                placeholder="Example: France"
                value={formData.country}
                onChange={handleChange}
                className={
                  errors.country ? "input-error" : ""
                }
              />

              {errors.country && (
                <small className="error-message">
                  {errors.country}
                </small>
              )}

            </div>

            <div className="form-group full-width">

              <label htmlFor="description">
                Description
                <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe this destination..."
                value={formData.description}
                onChange={handleChange}
                className={
                  errors.description ? "input-error" : ""
                }
              />

              {errors.description && (
                <small className="error-message">
                  {errors.description}
                </small>
              )}

            </div>

            <div className="form-group full-width">

              <label htmlFor="image">
                Image URL
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                className={errors.image ? "input-error" : ""}
              />

              {errors.image && (
                <small className="error-message">
                  {errors.image}
                </small>
              )}

            </div>

            <div className="form-group">

              <label htmlFor="status">
                Status
                <span>*</span>
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

              {errors.status && (
                <small className="error-message">
                  {errors.status}
                </small>
              )}

            </div>

          </div>

        </div>

        {formData.image && !errors.image && (
          <div className="image-preview-section">

            <h3>Image Preview</h3>

            <img
              src={formData.image}
              alt="Destination preview"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

          </div>
        )}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/destinations")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-destination-button"
          >
            <Save size={18} />

            {isEditMode
              ? "Update Destination"
              : "Save Destination"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default DestinationForm;