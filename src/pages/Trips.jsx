import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Pencil,
  Plane,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import defaultTrips from "../data/trips";
import "./Trips.css";

function Trips() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTrip, setDeleteTrip] = useState(null);

  const tripsPerPage = 6;

  useEffect(() => {
    const loadTrips = () => {
      try {
        const savedTrips = JSON.parse(
          localStorage.getItem("travelgo_trips")
        );

        if (Array.isArray(savedTrips) && savedTrips.length > 0) {
          setTrips(savedTrips);
          return;
        }

        const normalizedTrips = defaultTrips.map((trip) => ({
          ...trip,
          title: trip.title || trip.name,
          destination: trip.destination || trip.country || "",
          price: Number(trip.price || 0),
          seats: Number(trip.seats || trip.availableSeats || 0),
          status: trip.status || "Upcoming"
        }));

        localStorage.setItem(
          "travelgo_trips",
          JSON.stringify(normalizedTrips)
        );

        setTrips(normalizedTrips);
      } catch {
        const normalizedTrips = defaultTrips.map((trip) => ({
          ...trip,
          title: trip.title || trip.name,
          destination: trip.destination || trip.country || "",
          price: Number(trip.price || 0),
          seats: Number(trip.seats || trip.availableSeats || 0),
          status: trip.status || "Upcoming"
        }));

        localStorage.setItem(
          "travelgo_trips",
          JSON.stringify(normalizedTrips)
        );

        setTrips(normalizedTrips);
        showToast("Default trips loaded.", "success");
      }
    };

    loadTrips();
  }, [showToast]);

  const getDateValue = (value) => {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const isDateInsideTrip = (trip, selectedDate) => {
    if (!selectedDate) {
      return true;
    }

    const selected = getDateValue(selectedDate);
    const start = getDateValue(trip.startDate);
    const end = getDateValue(trip.endDate);

    if (!selected) {
      return false;
    }

    if (!start && !end) {
      return false;
    }

    if (start && end) {
      return selected >= start && selected <= end;
    }

    if (start) {
      return selected.getTime() === start.getTime();
    }

    return selected.getTime() === end.getTime();
  };

  const filteredTrips = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = trips.filter((trip) => {
      const title = String(
        trip.title || trip.name || ""
      ).toLowerCase();

      const destination = String(
        trip.destination || ""
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        destination.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        String(trip.status || "") === statusFilter;

      const matchesDate = isDateInsideTrip(
        trip,
        dateFilter
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });

    result.sort((first, second) => {
      if (sortBy === "newest") {
        return (
          new Date(second.startDate || 0).getTime() -
          new Date(first.startDate || 0).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(first.startDate || 0).getTime() -
          new Date(second.startDate || 0).getTime()
        );
      }

      if (sortBy === "priceHigh") {
        return (
          Number(second.price || 0) -
          Number(first.price || 0)
        );
      }

      if (sortBy === "priceLow") {
        return (
          Number(first.price || 0) -
          Number(second.price || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    trips,
    searchTerm,
    statusFilter,
    dateFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrips.length / tripsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * tripsPerPage;

  const visibleTrips = filteredTrips.slice(
    startIndex,
    startIndex + tripsPerPage
  );

  const upcomingCount = trips.filter(
    (trip) => trip.status === "Upcoming"
  ).length;

  const destinationCount = new Set(
    trips
      .map((trip) => trip.destination)
      .filter(Boolean)
  ).size;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateFilter("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const confirmDelete = () => {
    if (!deleteTrip) {
      return;
    }

    try {
      const updatedTrips = trips.filter(
        (trip) =>
          String(trip.id) !== String(deleteTrip.id)
      );

      localStorage.setItem(
        "travelgo_trips",
        JSON.stringify(updatedTrips)
      );

      setTrips(updatedTrips);
      setDeleteTrip(null);

      const newTotalPages = Math.max(
        1,
        Math.ceil(updatedTrips.length / tripsPerPage)
      );

      setCurrentPage((previousPage) =>
        Math.min(previousPage, newTotalPages)
      );

      showToast(
        "Trip deleted successfully",
        "success"
      );
    } catch {
      showToast(
        "Unable to delete trip.",
        "error"
      );
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "All" ||
    dateFilter ||
    sortBy !== "newest";

  return (
    <div className="trips-page">
      <div className="trips-page-header">
        <div>
          <span className="page-eyebrow">
            TRAVEL MANAGEMENT
          </span>

          <h1>Trips</h1>

          <p>
            Manage your travel packages and upcoming
            journeys.
          </p>
        </div>

        <Link
          to="/trips/create"
          className="create-trip-button"
        >
          <Plus size={18} />
          Create Trip
        </Link>
      </div>

      <div className="trips-summary">
        <div className="trip-summary-item">
          <div className="trip-summary-icon">
            <Plane size={20} />
          </div>

          <div>
            <span>Total Trips</span>
            <strong>{trips.length}</strong>
          </div>
        </div>

        <div className="trip-summary-item">
          <div className="trip-summary-icon">
            <MapPin size={20} />
          </div>

          <div>
            <span>Destinations</span>
            <strong>{destinationCount}</strong>
          </div>
        </div>

        <div className="trip-summary-item">
          <div className="trip-summary-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Upcoming</span>
            <strong>{upcomingCount}</strong>
          </div>
        </div>
      </div>

      <div className="trips-toolbar">
        <div className="trips-search">
          <Search size={18} />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search trips or destinations..."
          />

          {searchTerm && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="trips-filter">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter by status"
          >
            <option value="All">
              All Status
            </option>

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

        <div className="trips-date-filter">
          <CalendarDays size={17} />

          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            aria-label="Filter trips by date"
          />
        </div>

        <div className="trips-filter">
          <select
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort trips"
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="priceHigh">
              Price: High to Low
            </option>

            <option value="priceLow">
              Price: Low to High
            </option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="trips-filter-summary">
          <span>
            Showing {filteredTrips.length} trip
            {filteredTrips.length !== 1 ? "s" : ""}
          </span>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="trips-table-card">
        <div className="trips-table-header">
          <div>
            <span className="section-eyebrow">
              TRAVEL COLLECTION
            </span>

            <h2>All Trips</h2>

            <p>
              {filteredTrips.length} trips available
            </p>
          </div>

          <div className="trips-result-count">
            {filteredTrips.length}
          </div>
        </div>

        {visibleTrips.length === 0 ? (
          <div className="trips-empty-state">
            <div className="empty-icon">
              <Plane size={28} />
            </div>

            <h3>No trips found</h3>

            <p>
              Try changing your search or filter
              criteria.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="trips-table-wrapper">
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>TRIP</th>
                    <th>TRAVEL DATES</th>
                    <th>PRICE</th>
                    <th>SEATS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        <div className="trip-name-cell">
                          <div className="trip-location-icon">
                            <MapPin size={18} />
                          </div>

                          <div>
                            <strong>
                              {trip.title || trip.name}
                            </strong>

                            <span>
                              <MapPin size={13} />
                              {trip.destination}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="travel-date-cell">
                          <CalendarDays size={16} />

                          <div>
                            <strong>
                              {formatDate(
                                trip.startDate
                              )}
                            </strong>

                            <span>
                              to{" "}
                              {formatDate(
                                trip.endDate
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="trip-price">
                          {formatPrice(trip.price)}
                        </strong>
                      </td>

                      <td>
                        <span className="seat-badge">
                          {trip.seats}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`trip-status ${String(
                            trip.status || ""
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          <span></span>
                          {trip.status}
                        </span>
                      </td>

                      <td>
                        <div className="trip-actions">
                          <button
                            type="button"
                            className="action-button"
                            onClick={() =>
                              navigate(
                                `/trips/${trip.id}`
                              )
                            }
                            aria-label={`View ${
                              trip.title ||
                              trip.name
                            }`}
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            className="action-button edit-action"
                            onClick={() =>
                              navigate(
                                `/trips/${trip.id}/edit`
                              )
                            }
                            aria-label={`Edit ${
                              trip.title ||
                              trip.name
                            }`}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            className="action-button delete-action"
                            onClick={() =>
                              setDeleteTrip(trip)
                            }
                            aria-label={`Delete ${
                              trip.title ||
                              trip.name
                            }`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="trips-pagination">
                <span>
                  Showing {startIndex + 1}-
                  {Math.min(
                    startIndex + tripsPerPage,
                    filteredTrips.length
                  )}{" "}
                  of {filteredTrips.length}
                </span>

                <div className="pagination-controls">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((previous) =>
                        Math.max(
                          1,
                          previous - 1
                        )
                      )
                    }
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(page)
                      }
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage((previous) =>
                        Math.min(
                          totalPages,
                          previous + 1
                        )
                      )
                    }
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {deleteTrip && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <button
              type="button"
              className="delete-modal-close"
              onClick={() => setDeleteTrip(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="delete-modal-icon">
              <Trash2 size={24} />
            </div>

            <h3>Delete Trip?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTrip.title ||
                  deleteTrip.name}
              </strong>
              ?
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-delete-button"
                onClick={() => setDeleteTrip(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={confirmDelete}
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trips;