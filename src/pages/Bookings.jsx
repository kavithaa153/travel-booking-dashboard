import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  UserRound,
  MapPin,
  CreditCard
} from "lucide-react";
import Modal from "../components/common/Modal";
import { useAppContext } from "../context/AppContext";
import defaultBookings from "../data/bookings";
import "./Bookings.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStatus, setBookingStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [deleteBookingId, setDeleteBookingId] =
    useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const { showToast } = useAppContext();

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("travelgo_bookings")
      );

      if (Array.isArray(savedBookings) && savedBookings.length > 0) {
        setBookings(savedBookings);
      } else {
        localStorage.setItem(
          "travelgo_bookings",
          JSON.stringify(defaultBookings)
        );

        setBookings(defaultBookings);
      }
    } catch (error) {
      localStorage.setItem(
        "travelgo_bookings",
        JSON.stringify(defaultBookings)
      );

      setBookings(defaultBookings);

      showToast(
        "Unable to load bookings.",
        "error"
      );
    }
  }, [showToast]);

  const openDeleteModal = (id) => {
    setDeleteBookingId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteBookingId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    try {
      const updatedBookings = bookings.filter(
        (booking) =>
          booking.id !== deleteBookingId
      );

      setBookings(updatedBookings);

      localStorage.setItem(
        "travelgo_bookings",
        JSON.stringify(updatedBookings)
      );

      closeDeleteModal();

      showToast(
        "Booking deleted successfully",
        "success"
      );
    } catch (error) {
      showToast(
        "Unable to delete booking.",
        "error"
      );
    }
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (booking) =>
          booking.customerName
            ?.toLowerCase()
            .includes(search) ||
          booking.tripName
            ?.toLowerCase()
            .includes(search) ||
          booking.bookingId
            ?.toLowerCase()
            .includes(search)
      );
    }

    if (bookingStatus !== "All") {
      result = result.filter(
        (booking) =>
          booking.bookingStatus ===
          bookingStatus
      );
    }

    if (paymentStatus !== "All") {
      result = result.filter(
        (booking) =>
          booking.paymentStatus ===
          paymentStatus
      );
    }

    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          Number(b.id) - Number(a.id)
      );
    }

    if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          Number(a.id) - Number(b.id)
      );
    }

    if (sortOrder === "amountHigh") {
      result.sort(
        (a, b) =>
          Number(b.totalAmount) -
          Number(a.totalAmount)
      );
    }

    if (sortOrder === "amountLow") {
      result.sort(
        (a, b) =>
          Number(a.totalAmount) -
          Number(b.totalAmount)
      );
    }

    return result;
  }, [
    bookings,
    searchTerm,
    bookingStatus,
    paymentStatus,
    sortOrder
  ]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Pending"
  ).length;

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalAmount || 0),
    0
  );

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h1>Bookings</h1>

          <p>
            Manage customer reservations and payment
            status.
          </p>
        </div>

        <Link
          to="/bookings/create"
          className="create-booking-btn"
        >
          <Plus size={18} />
          Create Booking
        </Link>
      </div>

      <div className="bookings-stats">
        <div className="booking-stat-card">
          <div className="booking-stat-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Total Bookings</span>
            <strong>{totalBookings}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon confirmed">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Confirmed</span>
            <strong>{confirmedBookings}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon pending">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingBookings}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon revenue">
            <CreditCard size={20} />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>

      <div className="bookings-toolbar">
        <div className="booking-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search customer, trip or booking ID..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="booking-filter">
          <select
            value={bookingStatus}
            onChange={(event) =>
              setBookingStatus(event.target.value)
            }
          >
            <option value="All">
              All Booking Status
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div className="booking-filter">
          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value)
            }
          >
            <option value="All">
              All Payment Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Partial">
              Partial
            </option>

            <option value="Refunded">
              Refunded
            </option>
          </select>
        </div>

        <div className="booking-filter">
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="amountHigh">
              Amount: High to Low
            </option>

            <option value="amountLow">
              Amount: Low to High
            </option>
          </select>
        </div>
      </div>

      <div className="bookings-card">
        <div className="bookings-card-header">
          <div>
            <h2>All Bookings</h2>

            <span>
              {filteredBookings.length} booking
              {filteredBookings.length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bookings-empty">
            <div className="booking-empty-icon">
              <CalendarDays size={28} />
            </div>

            <h3>No bookings found</h3>

            <p>
              {bookings.length === 0
                ? "Create your first booking to get started."
                : "Try changing your search or filters."}
            </p>

            {bookings.length === 0 && (
              <Link
                to="/bookings/create"
                className="empty-booking-btn"
              >
                <Plus size={17} />
                Create Booking
              </Link>
            )}
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Trip</th>
                  <th>Travel Date</th>
                  <th>Amount</th>
                  <th>Booking Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map(
                  (booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="booking-id-cell">
                          <div className="booking-icon">
                            <CalendarDays size={17} />
                          </div>

                          <div>
                            <strong>
                              {booking.bookingId}
                            </strong>

                            <span>
                              {formatDate(
                                booking.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="booking-customer-cell">
                          <div className="booking-customer-icon">
                            <UserRound size={16} />
                          </div>

                          <span>
                            {booking.customerName}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="booking-trip-cell">
                          <MapPin size={15} />

                          <span>
                            {booking.tripName}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="booking-date">
                          {formatDate(
                            booking.travelDate
                          )}
                        </span>
                      </td>

                      <td>
                        <strong className="booking-amount">
                          ₹
                          {Number(
                            booking.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`booking-status ${
                            booking.bookingStatus?.toLowerCase()
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`payment-status ${
                            booking.paymentStatus?.toLowerCase()
                          }`}
                        >
                          <CreditCard size={13} />
                          {booking.paymentStatus}
                        </span>
                      </td>

                      <td>
                        <div className="booking-actions">
                          <Link
                            to={`/bookings/${booking.id}`}
                            className="booking-action view"
                            title="View Booking"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/bookings/${booking.id}/edit`}
                            className="booking-action edit"
                            title="Edit Booking"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            className="booking-action delete"
                            title="Delete Booking"
                            onClick={() =>
                              openDeleteModal(
                                booking.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Booking?"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        confirmText="Delete Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
}

export default Bookings;