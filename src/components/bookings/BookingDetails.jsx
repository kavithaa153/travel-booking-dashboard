import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  User,
  MapPin,
  CalendarDays,
  Users,
  CreditCard,
  Hash,
  IndianRupee,
} from "lucide-react";
import "./BookingDetails.css";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const savedBookings =
      JSON.parse(localStorage.getItem("travelgo_bookings")) || [];

    const foundBooking = savedBookings.find(
      (item) => String(item.id) === String(id)
    );

    if (!foundBooking) {
      setNotFound(true);
      return;
    }

    setBooking(foundBooking);
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  const getPaymentStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  if (notFound) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-not-found">
          <div className="booking-not-found-icon">
            <Hash size={25} />
          </div>

          <h2>Booking Not Found</h2>

          <p>
            The booking you are looking for does not exist or may have been
            deleted.
          </p>

          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="booking-back-button"
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-loading">
          Loading booking details...
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-page">
      <div className="booking-details-header">
        <div>
          <button
            type="button"
            className="booking-details-back"
            onClick={() => navigate("/bookings")}
          >
            <ArrowLeft size={18} />
            Back to Bookings
          </button>

          <h1>Booking Details</h1>

          <p>
            View complete information about this customer reservation.
          </p>
        </div>

        <Link
          to={`/bookings/${booking.id}/edit`}
          className="booking-edit-button"
        >
          <Pencil size={17} />
          Edit Booking
        </Link>
      </div>

      <div className="booking-details-layout">
        <div className="booking-main-card">
          <div className="booking-card-top">
            <div>
              <span className="booking-label">Booking ID</span>
              <h2>{booking.bookingId}</h2>
            </div>

            <span
              className={`booking-status-badge ${getBookingStatusClass(
                booking.bookingStatus
              )}`}
            >
              {booking.bookingStatus}
            </span>
          </div>

          <div className="booking-details-grid">
            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <User size={18} />
              </div>

              <div>
                <span>Customer</span>
                <strong>{booking.customerName || "-"}</strong>
              </div>
            </div>

            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <MapPin size={18} />
              </div>

              <div>
                <span>Trip</span>
                <strong>{booking.tripName || "-"}</strong>
              </div>
            </div>

            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <CalendarDays size={18} />
              </div>

              <div>
                <span>Travel Date</span>
                <strong>{formatDate(booking.travelDate)}</strong>
              </div>
            </div>

            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <Users size={18} />
              </div>

              <div>
                <span>Guests</span>
                <strong>
                  {booking.numberOfGuests}{" "}
                  {Number(booking.numberOfGuests) === 1
                    ? "Guest"
                    : "Guests"}
                </strong>
              </div>
            </div>

            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <CreditCard size={18} />
              </div>

              <div>
                <span>Payment Status</span>
                <strong>
                  <span
                    className={`payment-status-badge ${getPaymentStatusClass(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </strong>
              </div>
            </div>

            <div className="booking-detail-item">
              <div className="booking-detail-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>Total Amount</span>
                <strong className="booking-total-small">
                  ₹
                  {Number(booking.totalAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-summary-card">
          <div className="booking-summary-icon">
            <CreditCard size={21} />
          </div>

          <h3>Payment Summary</h3>

          <div className="summary-row">
            <span>Price per guest</span>
            <strong>
              ₹
              {(
                Number(booking.totalAmount || 0) /
                Math.max(Number(booking.numberOfGuests || 1), 1)
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="summary-row">
            <span>Number of guests</span>
            <strong>{booking.numberOfGuests}</strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <strong>
              ₹
              {Number(booking.totalAmount || 0).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="payment-status-box">
            <span>Payment</span>

            <strong
              className={`payment-status-badge ${getPaymentStatusClass(
                booking.paymentStatus
              )}`}
            >
              {booking.paymentStatus}
            </strong>
          </div>
        </div>
      </div>

      <div className="booking-meta-card">
        <div>
          <span>Booking Created</span>
          <strong>
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleString("en-IN")
              : "-"}
          </strong>
        </div>

        <div>
          <span>Customer ID</span>
          <strong>{booking.customerId || "-"}</strong>
        </div>

        <div>
          <span>Trip ID</span>
          <strong>{booking.tripId || "-"}</strong>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;