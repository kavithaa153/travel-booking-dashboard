import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import "./BookingForm.css";

const initialFormData = {
  customerId: "",
  tripId: "",
  travelDate: "",
  numberOfGuests: "1",
  bookingStatus: "Pending",
  paymentStatus: "Pending",
};

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [customers, setCustomers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("travelgo_customers")
        ) || [];

      const savedTrips =
        JSON.parse(
          localStorage.getItem("travelgo_trips")
        ) || [];

      setCustomers(savedCustomers);
      setTrips(savedTrips);

      if (!isEditMode) return;

      const savedBookings =
        JSON.parse(
          localStorage.getItem("travelgo_bookings")
        ) || [];

      const booking = savedBookings.find(
        (item) => String(item.id) === String(id)
      );

      if (!booking) {
        setNotFound(true);
        return;
      }

      setFormData({
        customerId: String(booking.customerId || ""),
        tripId: String(booking.tripId || ""),
        travelDate: booking.travelDate || "",
        numberOfGuests: String(
          booking.numberOfGuests || 1
        ),
        bookingStatus:
          booking.bookingStatus || "Pending",
        paymentStatus:
          booking.paymentStatus || "Pending",
      });
    } catch (error) {
      showToast(
        "Unable to load booking information.",
        "error"
      );
    }
  }, [id, isEditMode, showToast]);

  const selectedTrip = trips.find(
    (trip) =>
      String(trip.id) === String(formData.tripId)
  );

  const pricePerPerson = Number(
    selectedTrip?.price || 0
  );

  const totalAmount =
    pricePerPerson *
    Number(formData.numberOfGuests || 0);

  const validateField = (name, value) => {
    let error = "";

    if (name === "customerId" && !value) {
      error = "Please select a customer";
    }

    if (name === "tripId" && !value) {
      error = "Please select a trip";
    }

    if (name === "travelDate" && !value) {
      error = "Travel date is required";
    }

    if (name === "numberOfGuests") {
      if (!value) {
        error = "Number of guests is required";
      } else if (Number(value) < 1) {
        error = "At least 1 guest is required";
      } else if (
        selectedTrip &&
        Number(value) > Number(selectedTrip.seats)
      ) {
        error = `Only ${selectedTrip.seats} seats are available`;
      }
    }

    if (name === "bookingStatus" && !value) {
      error = "Booking status is required";
    }

    if (name === "paymentStatus" && !value) {
      error = "Payment status is required";
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

    if (
      formData.travelDate &&
      selectedTrip?.startDate &&
      formData.travelDate < selectedTrip.startDate
    ) {
      newErrors.travelDate =
        "Travel date cannot be before the trip start date";
    }

    if (
      formData.travelDate &&
      selectedTrip?.endDate &&
      formData.travelDate > selectedTrip.endDate
    ) {
      newErrors.travelDate =
        "Travel date cannot be after the trip end date";
    }

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

    const newErrors = {
      ...errors,
      [name]: validateField(name, value),
    };

    if (name === "tripId") {
      const newTrip = trips.find(
        (trip) =>
          String(trip.id) === String(value)
      );

      if (
        newTrip &&
        Number(updatedData.numberOfGuests) >
          Number(newTrip.seats)
      ) {
        newErrors.numberOfGuests =
          `Only ${newTrip.seats} seats are available`;
      } else {
        newErrors.numberOfGuests = "";
      }

      if (updatedData.travelDate) {
        if (
          newTrip?.startDate &&
          updatedData.travelDate < newTrip.startDate
        ) {
          newErrors.travelDate =
            "Travel date cannot be before the trip start date";
        } else if (
          newTrip?.endDate &&
          updatedData.travelDate > newTrip.endDate
        ) {
          newErrors.travelDate =
            "Travel date cannot be after the trip end date";
        } else {
          newErrors.travelDate = "";
        }
      }
    }

    if (name === "travelDate") {
      if (
        selectedTrip?.startDate &&
        value < selectedTrip.startDate
      ) {
        newErrors.travelDate =
          "Travel date cannot be before the trip start date";
      } else if (
        selectedTrip?.endDate &&
        value > selectedTrip.endDate
      ) {
        newErrors.travelDate =
          "Travel date cannot be after the trip end date";
      } else {
        newErrors.travelDate = "";
      }
    }

    if (name === "numberOfGuests") {
      const trip = trips.find(
        (item) =>
          String(item.id) ===
          String(updatedData.tripId)
      );

      if (
        trip &&
        Number(value) > Number(trip.seats)
      ) {
        newErrors.numberOfGuests =
          `Only ${trip.seats} seats are available`;
      } else {
        newErrors.numberOfGuests = "";
      }
    }

    setErrors(newErrors);
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

    const selectedCustomer = customers.find(
      (customer) =>
        String(customer.id) ===
        String(formData.customerId)
    );

    const selectedTripData = trips.find(
      (trip) =>
        String(trip.id) ===
        String(formData.tripId)
    );

    if (!selectedCustomer || !selectedTripData) {
      showToast(
        "Please select a valid customer and trip.",
        "error"
      );
      return;
    }

    try {
      const savedBookings =
        JSON.parse(
          localStorage.getItem("travelgo_bookings")
        ) || [];

      if (isEditMode) {
        const bookingExists = savedBookings.some(
          (booking) =>
            String(booking.id) === String(id)
        );

        if (!bookingExists) {
          showToast(
            "Booking could not be found.",
            "error"
          );
          return;
        }

        const updatedBookings = savedBookings.map(
          (booking) =>
            String(booking.id) === String(id)
              ? {
                  ...booking,
                  customerId:
                    selectedCustomer.id,
                  customerName:
                    selectedCustomer.name,
                  tripId: selectedTripData.id,
                  tripName:
                    selectedTripData.title,
                  travelDate:
                    formData.travelDate,
                  numberOfGuests: Number(
                    formData.numberOfGuests
                  ),
                  totalAmount,
                  bookingStatus:
                    formData.bookingStatus,
                  paymentStatus:
                    formData.paymentStatus,
                }
              : booking
        );

        localStorage.setItem(
          "travelgo_bookings",
          JSON.stringify(updatedBookings)
        );

        showToast(
          "Booking updated successfully",
          "success"
        );
      } else {
        const newBooking = {
          id: Date.now(),
          bookingId: `BK-${Date.now()
            .toString()
            .slice(-6)}`,
          customerId: selectedCustomer.id,
          customerName: selectedCustomer.name,
          tripId: selectedTripData.id,
          tripName: selectedTripData.title,
          travelDate: formData.travelDate,
          numberOfGuests: Number(
            formData.numberOfGuests
          ),
          totalAmount,
          bookingStatus:
            formData.bookingStatus,
          paymentStatus:
            formData.paymentStatus,
          createdAt:
            new Date().toISOString(),
        };

        localStorage.setItem(
          "travelgo_bookings",
          JSON.stringify([
            ...savedBookings,
            newBooking,
          ])
        );

        showToast(
          "Booking created successfully",
          "success"
        );
      }

      setTimeout(() => {
        navigate("/bookings");
      }, 500);
    } catch (error) {
      showToast(
        isEditMode
          ? "Unable to update booking."
          : "Unable to create booking.",
        "error"
      );
    }
  };

  if (notFound) {
    return (
      <div className="booking-form-page">
        <div className="booking-not-found">
          <h2>Booking Not Found</h2>

          <p>
            The booking you are looking for does not
            exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/bookings")}
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-page">
      <div className="booking-form-header">
        <button
          type="button"
          className="booking-back-button"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        <h1>
          {isEditMode
            ? "Edit Booking"
            : "Create Booking"}
        </h1>

        <p>
          {isEditMode
            ? "Update reservation and payment information."
            : "Create a new customer reservation."}
        </p>
      </div>

      <form
        className="booking-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="booking-form-section">
          <div className="booking-section-title">
            <div className="booking-section-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2>Booking Information</h2>

              <p>
                Select the customer and trip for this
                reservation.
              </p>
            </div>
          </div>

          <div className="booking-form-grid">
            <div className="booking-form-group">
              <label htmlFor="customerId">
                Customer <span>*</span>
              </label>

              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={
                  errors.customerId
                    ? "booking-input-error"
                    : ""
                }
              >
                <option value="">
                  Select customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>

              {errors.customerId && (
                <small className="booking-error">
                  {errors.customerId}
                </small>
              )}

              {customers.length === 0 && (
                <small className="booking-help">
                  No customers available. Create a
                  customer first.
                </small>
              )}
            </div>

            <div className="booking-form-group">
              <label htmlFor="tripId">
                Trip <span>*</span>
              </label>

              <select
                id="tripId"
                name="tripId"
                value={formData.tripId}
                onChange={handleChange}
                className={
                  errors.tripId
                    ? "booking-input-error"
                    : ""
                }
              >
                <option value="">
                  Select trip
                </option>

                {trips.map((trip) => (
                  <option
                    key={trip.id}
                    value={trip.id}
                  >
                    {trip.title} - ₹
                    {Number(
                      trip.price || 0
                    ).toLocaleString("en-IN")}
                  </option>
                ))}
              </select>

              {errors.tripId && (
                <small className="booking-error">
                  {errors.tripId}
                </small>
              )}

              {trips.length === 0 && (
                <small className="booking-help">
                  No trips available. Create a trip
                  first.
                </small>
              )}
            </div>

            <div className="booking-form-group">
              <label htmlFor="travelDate">
                Travel Date <span>*</span>
              </label>

              <input
                id="travelDate"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                min={
                  selectedTrip?.startDate ||
                  undefined
                }
                max={
                  selectedTrip?.endDate ||
                  undefined
                }
                onChange={handleChange}
                className={
                  errors.travelDate
                    ? "booking-input-error"
                    : ""
                }
              />

              {errors.travelDate && (
                <small className="booking-error">
                  {errors.travelDate}
                </small>
              )}

              {selectedTrip && (
                <small className="booking-help">
                  Trip dates:{" "}
                  {selectedTrip.startDate} to{" "}
                  {selectedTrip.endDate}
                </small>
              )}
            </div>

            <div className="booking-form-group">
              <label htmlFor="numberOfGuests">
                Number of Guests <span>*</span>
              </label>

              <input
                id="numberOfGuests"
                name="numberOfGuests"
                type="number"
                min="1"
                max={
                  selectedTrip?.seats ||
                  undefined
                }
                value={formData.numberOfGuests}
                onChange={handleChange}
                className={
                  errors.numberOfGuests
                    ? "booking-input-error"
                    : ""
                }
              />

              {errors.numberOfGuests && (
                <small className="booking-error">
                  {errors.numberOfGuests}
                </small>
              )}

              {selectedTrip && (
                <small className="booking-help">
                  Available seats:{" "}
                  {selectedTrip.seats}
                </small>
              )}
            </div>

            <div className="booking-form-group">
              <label htmlFor="bookingStatus">
                Booking Status <span>*</span>
              </label>

              <select
                id="bookingStatus"
                name="bookingStatus"
                value={formData.bookingStatus}
                onChange={handleChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="booking-form-group">
              <label htmlFor="paymentStatus">
                Payment Status <span>*</span>
              </label>

              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Refunded">
                  Refunded
                </option>
              </select>
            </div>
          </div>
        </div>

        {selectedTrip && (
          <div className="booking-summary">
            <div className="booking-summary-left">
              <span>Selected Trip</span>

              <strong>
                {selectedTrip.title}
              </strong>

              <small>
                ₹
                {Number(
                  selectedTrip.price || 0
                ).toLocaleString("en-IN")}{" "}
                per person
              </small>
            </div>

            <div className="booking-summary-right">
              <span>Total Amount</span>

              <strong>
                ₹
                {Number(
                  totalAmount
                ).toLocaleString("en-IN")}
              </strong>

              <small>
                {formData.numberOfGuests}{" "}
                {Number(
                  formData.numberOfGuests
                ) === 1
                  ? "guest"
                  : "guests"}
              </small>
            </div>
          </div>
        )}

        <div className="booking-form-actions">
          <button
            type="button"
            className="booking-cancel-button"
            onClick={() => navigate("/bookings")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="booking-save-button"
          >
            <Save size={18} />

            {isEditMode
              ? "Update Booking"
              : "Create Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;