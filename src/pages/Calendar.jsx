import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  MapPin,
  User,
} from "lucide-react";
import "./Calendar.css";

function Calendar() {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("travelgo_bookings") || "[]"
      );

      setBookings(Array.isArray(savedBookings) ? savedBookings : []);
    } catch {
      setBookings([]);
    }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate((date) => {
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    });
  };

  const nextMonth = () => {
    setCurrentDate((date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    });
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );
  };

  const bookingsByDate = useMemo(() => {
    const grouped = {};

    bookings.forEach((booking) => {
      if (!booking.travelDate) return;

      const date = new Date(booking.travelDate);

      if (Number.isNaN(date.getTime())) return;

      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(booking);
    });

    return grouped;
  }, [bookings]);

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const formatDateKey = (day) => {
    if (!day) return null;

    return [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
  };

  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const upcomingBookings = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return [...bookings]
      .filter((booking) => {
        if (!booking.travelDate) return false;

        const travelDate = new Date(booking.travelDate);

        if (Number.isNaN(travelDate.getTime())) return false;

        travelDate.setHours(0, 0, 0, 0);

        return travelDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.travelDate).getTime() -
          new Date(b.travelDate).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <h1>Calendar</h1>
          <p>Track upcoming travel dates and customer bookings.</p>
        </div>

        <button
          type="button"
          className="calendar-today-button"
          onClick={goToToday}
        >
          <CalendarDays size={17} />
          Today
        </button>
      </div>

      <div className="calendar-layout">
        <div className="calendar-card">
          <div className="calendar-toolbar">
            <button
              type="button"
              className="calendar-nav-button"
              onClick={previousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <h2>{monthName}</h2>

            <button
              type="button"
              className="calendar-nav-button"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const dateKey = formatDateKey(day);
              const dayBookings = dateKey
                ? bookingsByDate[dateKey] || []
                : [];

              return (
                <div
                  key={`${dateKey || "empty"}-${index}`}
                  className={`calendar-day ${
                    !day ? "calendar-empty-day" : ""
                  } ${
                    isToday(day) ? "calendar-current-day" : ""
                  }`}
                >
                  {day && (
                    <>
                      <div className="calendar-day-number">
                        {day}
                      </div>

                      <div className="calendar-events">
                        {dayBookings.slice(0, 2).map((booking) => (
                          <div
                            key={booking.id}
                            className={`calendar-event ${
                              booking.bookingStatus?.toLowerCase() ||
                              "pending"
                            }`}
                            title={`${booking.customerName || ""} - ${
                              booking.tripName || ""
                            }`}
                          >
                            <span>
                              {booking.customerName || "Customer"}
                            </span>
                          </div>
                        ))}

                        {dayBookings.length > 2 && (
                          <small className="more-events">
                            +{dayBookings.length - 2} more
                          </small>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="upcoming-card">
          <div className="upcoming-header">
            <div>
              <h2>Upcoming Trips</h2>
              <p>Your next travel bookings</p>
            </div>

            <Clock3 size={20} />
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="calendar-empty">
              <CalendarDays size={28} />
              <h3>No upcoming bookings</h3>
              <p>Create a booking to see it here.</p>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcomingBookings.map((booking) => {
                const travelDate = new Date(booking.travelDate);

                return (
                  <div
                    className="upcoming-item"
                    key={booking.id}
                  >
                    <div className="upcoming-date">
                      <strong>
                        {travelDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                        })}
                      </strong>

                      <span>
                        {travelDate.toLocaleDateString("en-IN", {
                          month: "short",
                        })}
                      </span>
                    </div>

                    <div className="upcoming-info">
                      <h3>
                        {booking.tripName || "Travel Trip"}
                      </h3>

                      <div>
                        <User size={13} />
                        {booking.customerName || "Customer"}
                      </div>

                      <div>
                        <MapPin size={13} />
                        {booking.numberOfGuests || 0}{" "}
                        {Number(booking.numberOfGuests) === 1
                          ? "guest"
                          : "guests"}
                      </div>
                    </div>

                    <span
                      className={`upcoming-status ${
                        booking.bookingStatus?.toLowerCase() ||
                        "pending"
                      }`}
                    >
                      {booking.bookingStatus || "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;