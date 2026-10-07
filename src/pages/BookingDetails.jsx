import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  User,
  Users,
  Wallet,
  Plane,
  Clock3,
  Pencil
} from "lucide-react";
import Loading from "../common/Loading";
import { useAppContext } from "../../context/AppContext";
import "./BookingDetails.css";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedBookings =
        JSON.parse(localStorage.getItem("travelgo_bookings")) || [];

      const foundBooking = savedBookings.find(
        (item) => String(item.id) === String(id)
      );

      setBooking(foundBooking || null);

      if (!foundBooking) {
        showToast("Booking could not be found.", "error");
      }
    } catch (error) {
      showToast("Unable to load booking details.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="booking-details-page">
        <Loading message="Loading booking details..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-empty">
          <div className="booking-empty-icon">
            <CalendarDays size={32} />
          </div>

          <h2>Booking Not Found</h2>

          <p>
            The booking you are looking for does not exist or may have been
            removed.
          </p>

          <button
            type="button"
            className="booking-primary-button"
            onClick={() => navigate("/bookings")}
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const bookingStatus = booking.bookingStatus || "Pending";
  const paymentStatus = booking.paymentStatus || "Pending";

  const statusClass = bookingStatus.toLowerCase().replace(/\s+/g, "-");
  const paymentClass = paymentStatus.toLowerCase().replace(/\s+/g, "-");

  const formattedDate = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : "Not available";

  const createdDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "Not available";

  const totalAmount = Number(booking.totalAmount || 0);

  return (
    <div className="booking-details-page">
      <div className="booking-details-header">
        <button
          type="button"
          className="booking-back-button"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft size={17} />
          Back to Bookings
        </button>

        <div className="booking-title-row">
          <div>
            <span className="booking-label">BOOKING DETAILS</span>

            <h1>{booking.bookingId || booking.id}</h1>

            <p>
              Complete information about this customer booking and travel
              reservation.
            </p>
          </div>

          <div className="booking-header-actions">
            <button
              type="button"
              className="booking-edit-button"
              onClick={() => navigate(`/bookings/${booking.id}/edit`)}
            >
              <Pencil size={16} />
              Edit Booking
            </button>
          </div>
        </div>
      </div>

      <div className="booking-status-strip">
        <div className="booking-status-item">
          <span>Booking Status</span>

          <strong className={`booking-status-badge ${statusClass}`}>
            {bookingStatus}
          </strong>
        </div>

        <div className="booking-status-item">
          <span>Payment Status</span>

          <strong className={`payment-status-badge ${paymentClass}`}>
            {paymentStatus}
          </strong>
        </div>

        <div className="booking-status-item">
          <span>Travel Date</span>

          <strong>{formattedDate}</strong>
        </div>
      </div>

      <div className="booking-details-grid">
        <section className="booking-details-card booking-main-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon">
              <Plane size={20} />
            </div>

            <div>
              <h2>Trip Information</h2>
              <p>Travel reservation details</p>
            </div>
          </div>

          <div className="booking-trip-highlight">
            <div className="booking-trip-icon">
              <MapPin size={24} />
            </div>

            <div>
              <span>Trip</span>

              <h3>{booking.tripName || "Travel Trip"}</h3>

              <p>Selected trip for this booking</p>
            </div>
          </div>

          <div className="booking-info-grid">
            <div className="booking-info-item">
              <div className="booking-info-icon">
                <CalendarDays size={18} />
              </div>

              <div>
                <span>Travel Date</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <div className="booking-info-item">
              <div className="booking-info-icon">
                <Users size={18} />
              </div>

              <div>
                <span>Number of Guests</span>

                <strong>
                  {booking.numberOfGuests || 0}{" "}
                  {Number(booking.numberOfGuests) === 1
                    ? "Guest"
                    : "Guests"}
                </strong>
              </div>
            </div>

            <div className="booking-info-item">
              <div className="booking-info-icon">
                <Clock3 size={18} />
              </div>

              <div>
                <span>Booking Created</span>
                <strong>{createdDate}</strong>
              </div>
            </div>

            <div className="booking-info-item">
              <div className="booking-info-icon">
                <CreditCard size={18} />
              </div>

              <div>
                <span>Booking ID</span>
                <strong>{booking.bookingId || booking.id}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="booking-details-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Customer Information</h2>
              <p>Guest details</p>
            </div>
          </div>

          <div className="customer-profile-box">
            <div className="customer-avatar">
              {(booking.customerName || "C").charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{booking.customerName || "Customer"}</h3>

              <p>Registered TravelGo customer</p>
            </div>
          </div>

          <div className="customer-details-list">
            <div>
              <span>Customer Name</span>

              <strong>
                {booking.customerName || "Not available"}
              </strong>
            </div>

            <div>
              <span>Customer ID</span>

              <strong>
                {booking.customerId || "Not available"}
              </strong>
            </div>

            <div>
              <span>Number of Guests</span>

              <strong>
                {booking.numberOfGuests || 0}
              </strong>
            </div>
          </div>
        </section>

        <section className="booking-details-card booking-payment-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon">
              <Wallet size={20} />
            </div>

            <div>
              <h2>Payment Information</h2>
              <p>Payment and amount details</p>
            </div>
          </div>

          <div className="payment-total-box">
            <span>Total Amount</span>

            <strong>
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="payment-details-list">
            <div>
              <span>Payment Status</span>

              <strong
                className={`payment-status-badge ${paymentClass}`}
              >
                {paymentStatus}
              </strong>
            </div>

            <div>
              <span>Trip Price</span>

              <strong>
                ₹
                {booking.numberOfGuests
                  ? Math.round(
                      totalAmount /
                        Number(booking.numberOfGuests)
                    ).toLocaleString("en-IN")
                  : totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Guests</span>

              <strong>
                {booking.numberOfGuests || 0}
              </strong>
            </div>
          </div>
        </section>

        <section className="booking-details-card booking-notes-card">
          <div className="booking-card-heading">
            <div className="booking-card-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2>Booking Summary</h2>
              <p>Complete reservation summary</p>
            </div>
          </div>

          <div className="booking-notes-content">
            <span>Reservation</span>

            <p>
              {booking.customerName || "Customer"} has booked{" "}
              {booking.tripName || "the selected trip"} for{" "}
              {booking.numberOfGuests || 0}{" "}
              {Number(booking.numberOfGuests) === 1
                ? "guest"
                : "guests"}{" "}
              on {formattedDate}.
            </p>
          </div>
        </section>
      </div>

      <div className="booking-details-footer">
        <button
          type="button"
          className="booking-secondary-button"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft size={17} />
          Back to Bookings
        </button>

        <button
          type="button"
          className="booking-primary-button"
          onClick={() => navigate(`/bookings/${booking.id}/edit`)}
        >
          <Pencil size={17} />
          Edit Booking
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;