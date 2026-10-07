import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "./DestinationDetails.css";

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const savedDestinations =
      JSON.parse(
        localStorage.getItem("travelgo_destinations")
      ) || [];

    const selectedDestination = savedDestinations.find(
      (item) => String(item.id) === String(id)
    );

    setDestination(selectedDestination || null);
  }, [id]);

  if (!destination) {
    return (
      <div className="destination-details-page">
        <div className="destination-details-not-found">
          <div className="details-not-found-icon">
            <MapPin size={28} />
          </div>

          <h2>Destination Not Found</h2>

          <p>
            The destination you are looking for does not exist
            or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/destinations")}
          >
            <ArrowLeft size={17} />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  const isActive = destination.status === "Active";

  return (
    <div className="destination-details-page">

      <div className="destination-details-header">

        <button
          type="button"
          className="details-back-button"
          onClick={() => navigate("/destinations")}
        >
          <ArrowLeft size={18} />
          Back to Destinations
        </button>

        <button
          type="button"
          className="details-edit-button"
          onClick={() =>
            navigate(`/destinations/${destination.id}/edit`)
          }
        >
          <Pencil size={17} />
          Edit Destination
        </button>

      </div>

      <div className="destination-details-card">

        <div className="destination-details-image">

          {destination.image ? (
            <img
              src={destination.image}
              alt={destination.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling.style.display =
                  "flex";
              }}
            />
          ) : null}

          <div
            className="details-image-placeholder"
            style={{
              display: destination.image
                ? "none"
                : "flex",
            }}
          >
            <MapPin size={46} />
          </div>

          <span
            className={`details-status ${
              destination.status?.toLowerCase()
            }`}
          >
            {isActive ? (
              <CheckCircle2 size={15} />
            ) : (
              <XCircle size={15} />
            )}

            {destination.status}
          </span>

        </div>

        <div className="destination-details-content">

          <div className="details-title-section">

            <div>
              <span className="details-label">
                DESTINATION
              </span>

              <h1>{destination.name}</h1>

              <div className="details-location">
                <MapPin size={17} />
                <span>{destination.country}</span>
              </div>
            </div>

          </div>

          <div className="details-info-grid">

            <div className="details-info-card">

              <div className="details-info-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>Destination</span>
                <strong>{destination.name}</strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                <Globe size={19} />
              </div>

              <div>
                <span>Country</span>
                <strong>{destination.country}</strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                {isActive ? (
                  <CheckCircle2 size={19} />
                ) : (
                  <XCircle size={19} />
                )}
              </div>

              <div>
                <span>Status</span>
                <strong>{destination.status}</strong>
              </div>

            </div>

          </div>

          <div className="destination-description">

            <h2>About this destination</h2>

            <p>
              {destination.description ||
                "No description available for this destination."}
            </p>

          </div>

          <div className="destination-details-actions">

            <button
              type="button"
              className="details-secondary-button"
              onClick={() => navigate("/destinations")}
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <button
              type="button"
              className="details-primary-button"
              onClick={() =>
                navigate(`/destinations/${destination.id}/edit`)
              }
            >
              <Pencil size={17} />
              Edit Destination
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DestinationDetails;