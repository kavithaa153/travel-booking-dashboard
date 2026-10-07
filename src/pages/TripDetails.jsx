import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Pencil
} from "lucide-react";

import "./TripDetails.css";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const savedTrips =
      JSON.parse(localStorage.getItem("travelgo_trips")) || [];

    const selectedTrip = savedTrips.find(
      (item) => String(item.id) === String(id)
    );

    setTrip(selectedTrip || null);
  }, [id]);

  if (!trip) {
    return (
      <div className="trip-details-page">
        <div className="trip-details-empty">
          <h2>Trip Not Found</h2>
          <p>This trip is no longer available.</p>

          <button onClick={() => navigate("/trips")}>
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-page">

      <div className="trip-details-top">
        <button
          className="back-button"
          onClick={() => navigate("/trips")}
        >
          <ArrowLeft size={17} />
          Back to Trips
        </button>

        <button
          className="edit-trip-button"
          onClick={() =>
            navigate(`/trips/${trip.id}/edit`)
          }
        >
          <Pencil size={16} />
          Edit Trip
        </button>
      </div>

      <div className="trip-details-header">
        <div className="trip-details-avatar">
          {trip.title.charAt(0).toUpperCase()}
        </div>

        <div>
          <span className="details-eyebrow">
            TRIP DETAILS
          </span>

          <h1>{trip.title}</h1>

          <div className="details-destination">
            <MapPin size={16} />
            {trip.destination}
          </div>
        </div>

        <span
          className={`details-status ${trip.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {trip.status}
        </span>
      </div>

      <div className="trip-info-grid">

        <div className="trip-info-card">
          <div className="info-icon">
            <CalendarDays size={20} />
          </div>

          <span>Travel Dates</span>

          <strong>{trip.startDate}</strong>

          <small>to {trip.endDate}</small>
        </div>

        <div className="trip-info-card">
          <div className="info-icon">
            <Wallet size={20} />
          </div>

          <span>Trip Price</span>

          <strong>
            ₹{Number(trip.price).toLocaleString("en-IN")}
          </strong>

          <small>Per traveler</small>
        </div>

        <div className="trip-info-card">
          <div className="info-icon">
            <Users size={20} />
          </div>

          <span>Available Seats</span>

          <strong>{trip.seats}</strong>

          <small>Seats available</small>
        </div>

      </div>

      <div className="trip-summary-card">
        <div>
          <span className="details-eyebrow">
            TRIP SUMMARY
          </span>

          <h2>{trip.title}</h2>

          <p>
            This travel package is available for booking
            in {trip.destination}.
          </p>
        </div>

        <div className="summary-destination">
          <MapPin size={18} />
          <span>{trip.destination}</span>
        </div>
      </div>

    </div>
  );
}

export default TripDetails;