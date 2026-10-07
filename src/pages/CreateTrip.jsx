import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  IndianRupee,
  Users,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import "./CreateTrip.css";

const initialFormData = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  price: "",
  seats: "",
  status: "Upcoming"
};

function CreateTrip() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateField = (
    name,
    value,
    currentData = formData
  ) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) {
        error = "Trip name is required";
      } else if (value.trim().length < 3) {
        error = "Trip name must be at least 3 characters";
      }
    }

    if (name === "destination") {
      if (!value.trim()) {
        error = "Destination is required";
      } else if (value.trim().length < 2) {
        error = "Enter a valid destination";
      }
    }

    if (name === "startDate") {
      if (!value) {
        error = "Start date is required";
      }
    }

    if (name === "endDate") {
      if (!value) {
        error = "End date is required";
      } else if (
        currentData.startDate &&
        value < currentData.startDate
      ) {
        error = "End date cannot be before start date";
      }
    }

    if (name === "price") {
      if (!value) {
        error = "Price is required";
      } else if (Number(value) <= 0) {
        error = "Price must be greater than 0";
      }
    }

    if (name === "seats") {
      if (!value) {
        error = "Available seats are required";
      } else if (Number(value) <= 0) {
        error = "Seats must be greater than 0";
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
        formData[field],
        formData
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

    const error = validateField(
      name,
      value,
      updatedData
    );

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: error
    }));

    if (
      name === "startDate" &&
      updatedData.endDate
    ) {
      const endDateError = validateField(
        "endDate",
        updatedData.endDate,
        updatedData
      );

      setErrors((previousErrors) => ({
        ...previousErrors,
        endDate: endDateError
      }));
    }
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
      const newTrip = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        seats: Number(formData.seats)
      };

      const existingTrips =
        JSON.parse(
          localStorage.getItem("travelgo_trips")
        ) || [];

      const updatedTrips = [
        ...existingTrips,
        newTrip
      ];

      localStorage.setItem(
        "travelgo_trips",
        JSON.stringify(updatedTrips)
      );

      setFormData(initialFormData);
      setErrors({});

      showToast(
        "Trip created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/trips");
      }, 500);
    } catch (error) {
      showToast(
        "Unable to create trip.",
        "error"
      );
    }
  };

  return (
    <div className="create-trip-page">
      <div className="create-trip-header">
        <div>
          <button
            type="button"
            className="back-trip-button"
            onClick={() => navigate("/trips")}
          >
            <ArrowLeft size={16} />
            Back to Trips
          </button>

          <span className="page-eyebrow">
            TRIP MANAGEMENT
          </span>

          <h1>Create New Trip</h1>

          <p>
            Add a new travel package to your TravelGo
            dashboard.
          </p>
        </div>
      </div>

      <div className="trip-form-layout">
        <aside className="trip-form-intro">
          <div className="form-intro-icon">
            <MapPin size={22} />
          </div>

          <span>NEW JOURNEY</span>

          <h2>
            Create a journey
            <strong> worth remembering.</strong>
          </h2>

          <p>
            Add the essential details of your travel
            package and make it available for booking.
          </p>

          <div className="form-intro-list">
            <div>
              <CheckCircle2 size={16} />
              <span>Set your travel dates</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Define pricing and seats</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Choose trip availability</span>
            </div>
          </div>
        </aside>

        <div className="trip-form-card">
          <div className="form-card-heading">
            <div>
              <span>TRIP DETAILS</span>
              <h2>Travel Package Information</h2>
            </div>
          </div>

          <form
            className="trip-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="title">
                Trip Name <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.title ? "has-error" : ""
                }`}
              >
                <MapPin size={17} />

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Kerala Escape"
                />
              </div>

              {errors.title && (
                <small className="error-message">
                  {errors.title}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="destination">
                Destination <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.destination ? "has-error" : ""
                }`}
              >
                <MapPin size={17} />

                <input
                  id="destination"
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Example: Munnar, Kerala"
                />
              </div>

              {errors.destination && (
                <small className="error-message">
                  {errors.destination}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                Start Date <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.startDate ? "has-error" : ""
                }`}
              >
                <CalendarDays size={17} />

                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              {errors.startDate && (
                <small className="error-message">
                  {errors.startDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                End Date <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.endDate ? "has-error" : ""
                }`}
              >
                <CalendarDays size={17} />

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>

              {errors.endDate && (
                <small className="error-message">
                  {errors.endDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.price ? "has-error" : ""
                }`}
              >
                <IndianRupee size={17} />

                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="1"
                />
              </div>

              {errors.price && (
                <small className="error-message">
                  {errors.price}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="seats">
                Available Seats <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.seats ? "has-error" : ""
                }`}
              >
                <Users size={17} />

                <input
                  id="seats"
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="Enter available seats"
                  min="1"
                />
              </div>

              {errors.seats && (
                <small className="error-message">
                  {errors.seats}
                </small>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="status">
                Status <span>*</span>
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.status ? "has-error" : ""
                }`}
              >
                <CheckCircle2 size={17} />

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Upcoming">
                    Upcoming
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

              {errors.status && (
                <small className="error-message">
                  {errors.status}
                </small>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/trips")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
              >
                Create Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;