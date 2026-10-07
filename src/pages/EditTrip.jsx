import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  IndianRupee,
  Users,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import "./EditTrip.css";

const initialFormData = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  price: "",
  seats: "",
  status: "Upcoming"
};

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const savedTrips =
      JSON.parse(
        localStorage.getItem("travelgo_trips")
      ) || [];

    const trip = savedTrips.find(
      (item) => String(item.id) === String(id)
    );

    if (!trip) {
      setNotFound(true);
      return;
    }

    setFormData({
      title: trip.title || "",
      destination: trip.destination || "",
      startDate: trip.startDate || "",
      endDate: trip.endDate || "",
      price: trip.price ?? "",
      seats: trip.seats ?? "",
      status: trip.status || "Upcoming"
    });
  }, [id]);

  const validateField = (
    name,
    value,
    currentData
  ) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) {
        error = "Trip name is required";
      } else if (value.trim().length < 3) {
        error =
          "Trip name must be at least 3 characters";
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
        error =
          "End date cannot be before start date";
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
      const savedTrips =
        JSON.parse(
          localStorage.getItem("travelgo_trips")
        ) || [];

      const tripExists = savedTrips.some(
        (trip) => String(trip.id) === String(id)
      );

      if (!tripExists) {
        showToast(
          "Trip could not be found.",
          "error"
        );
        return;
      }

      const updatedTrips = savedTrips.map(
        (trip) => {
          if (String(trip.id) === String(id)) {
            return {
              ...trip,
              ...formData,
              price: Number(formData.price),
              seats: Number(formData.seats)
            };
          }

          return trip;
        }
      );

      localStorage.setItem(
        "travelgo_trips",
        JSON.stringify(updatedTrips)
      );

      showToast(
        "Trip updated successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/trips");
      }, 500);
    } catch (error) {
      showToast(
        "Unable to update trip.",
        "error"
      );
    }
  };

  if (notFound) {
    return (
      <div className="edit-trip-page">
        <div className="edit-not-found">
          <div className="not-found-icon">
            <MapPin size={26} />
          </div>

          <span className="page-eyebrow">
            TRIP MANAGEMENT
          </span>

          <h2>Trip Not Found</h2>

          <p>
            The trip you're trying to edit
            does not exist or may have been
            removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/trips")}
          >
            <ArrowLeft size={16} />
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-trip-page">
      <div className="edit-trip-header">
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

          <h1>Edit Trip</h1>

          <p>
            Update the details of your travel
            package.
          </p>
        </div>
      </div>

      <div className="edit-trip-layout">
        <aside className="edit-trip-intro">
          <div className="edit-intro-icon">
            <MapPin size={22} />
          </div>

          <span>UPDATE JOURNEY</span>

          <h2>
            Refine your
            <strong> next adventure.</strong>
          </h2>

          <p>
            Update the travel package details
            whenever your itinerary changes.
          </p>

          <div className="edit-intro-list">
            <div>
              <CheckCircle2 size={16} />
              <span>Update travel dates</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Adjust pricing and seats</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Change trip status</span>
            </div>
          </div>
        </aside>

        <div className="edit-trip-card">
          <div className="edit-card-heading">
            <div>
              <span>TRIP DETAILS</span>
              <h2>Update Travel Package</h2>
            </div>
          </div>

          <form
            className="edit-trip-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="edit-form-group">
              <label htmlFor="title">
                Trip Name <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
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
                  placeholder="Enter trip name"
                />
              </div>

              {errors.title && (
                <small>
                  {errors.title}
                </small>
              )}
            </div>

            <div className="edit-form-group">
              <label htmlFor="destination">
                Destination <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
                  errors.destination
                    ? "has-error"
                    : ""
                }`}
              >
                <MapPin size={17} />

                <input
                  id="destination"
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination"
                />
              </div>

              {errors.destination && (
                <small>
                  {errors.destination}
                </small>
              )}
            </div>

            <div className="edit-form-group">
              <label htmlFor="startDate">
                Start Date <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
                  errors.startDate
                    ? "has-error"
                    : ""
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
                <small>
                  {errors.startDate}
                </small>
              )}
            </div>

            <div className="edit-form-group">
              <label htmlFor="endDate">
                End Date <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
                  errors.endDate
                    ? "has-error"
                    : ""
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
                <small>
                  {errors.endDate}
                </small>
              )}
            </div>

            <div className="edit-form-group">
              <label htmlFor="price">
                Price <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
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
                <small>
                  {errors.price}
                </small>
              )}
            </div>

            <div className="edit-form-group">
              <label htmlFor="seats">
                Available Seats <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
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
                <small>
                  {errors.seats}
                </small>
              )}
            </div>

            <div className="edit-form-group edit-full-width">
              <label htmlFor="status">
                Status <span>*</span>
              </label>

              <div
                className={`edit-input-wrapper ${
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
                <small>
                  {errors.status}
                </small>
              )}
            </div>

            <div className="edit-form-actions">
              <button
                type="button"
                className="edit-cancel-button"
                onClick={() =>
                  navigate("/trips")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTrip;