import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  IndianRupee,
  Ticket,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./Analytics.css";

function Analytics() {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const savedBookings =
      JSON.parse(localStorage.getItem("travelgo_bookings")) || [];

    const savedTrips =
      JSON.parse(localStorage.getItem("travelgo_trips")) || [];

    setBookings(savedBookings);
    setTrips(savedTrips);
  }, []);

  const statistics = useMemo(() => {
    const totalBookings = bookings.length;

    const totalRevenue = bookings
      .filter((booking) => booking.paymentStatus !== "Refunded")
      .reduce(
        (total, booking) => total + Number(booking.totalAmount || 0),
        0
      );

    const totalGuests = bookings.reduce(
      (total, booking) =>
        total + Number(booking.numberOfGuests || 0),
      0
    );

    const confirmedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    return {
      totalBookings,
      totalRevenue,
      totalGuests,
      confirmedBookings,
    };
  }, [bookings]);

  const statusData = useMemo(() => {
    const statuses = [
      "Confirmed",
      "Pending",
      "Completed",
      "Cancelled",
    ];

    return statuses.map((status) => ({
      status,
      bookings: bookings.filter(
        (booking) => booking.bookingStatus === status
      ).length,
    }));
  }, [bookings]);

  const revenueData = useMemo(() => {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();

      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthName = date.toLocaleDateString("en-IN", {
        month: "short",
      });

      const revenue = bookings
        .filter((booking) => {
          if (!booking.createdAt) return false;

          const bookingDate = new Date(booking.createdAt);

          return (
            bookingDate.getMonth() === month &&
            bookingDate.getFullYear() === year &&
            booking.paymentStatus !== "Refunded"
          );
        })
        .reduce(
          (total, booking) =>
            total + Number(booking.totalAmount || 0),
          0
        );

      months.push({
        month: monthName,
        revenue,
      });
    }

    return months;
  }, [bookings]);

  const topTrips = useMemo(() => {
    const tripMap = {};

    bookings.forEach((booking) => {
      const tripName = booking.tripName || "Unknown Trip";

      if (!tripMap[tripName]) {
        tripMap[tripName] = {
          trip: tripName,
          bookings: 0,
          revenue: 0,
        };
      }

      tripMap[tripName].bookings += 1;
      tripMap[tripName].revenue += Number(
        booking.totalAmount || 0
      );
    });

    return Object.values(tripMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Track booking performance, revenue and customer activity.
          </p>
        </div>

        <div className="analytics-live">
          <span></span>
          Live Data
        </div>
      </div>

      <div className="analytics-stat-grid">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon blue">
            <Ticket size={21} />
          </div>

          <div>
            <span>Total Bookings</span>
            <strong>{statistics.totalBookings}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon green">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹
              {statistics.totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon orange">
            <Users size={21} />
          </div>

          <div>
            <span>Total Guests</span>
            <strong>{statistics.totalGuests}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Confirmed</span>
            <strong>{statistics.confirmedBookings}</strong>
          </div>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <div className="analytics-card revenue-chart-card">
          <div className="analytics-card-header">
            <div>
              <h2>Revenue Overview</h2>
              <p>Revenue generated during the last 6 months.</p>
            </div>

            <IndianRupee size={20} />
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${value >= 1000 ? `${value / 1000}k` : value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="#dbeafe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card status-chart-card">
          <div className="analytics-card-header">
            <div>
              <h2>Booking Status</h2>
              <p>Current booking distribution.</p>
            </div>

            <BarChart3 size={20} />
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="bookings"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-bottom-grid">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Top Performing Trips</h2>
              <p>Trips ranked by generated revenue.</p>
            </div>
          </div>

          {topTrips.length === 0 ? (
            <div className="analytics-empty">
              <BarChart3 size={28} />
              <h3>No booking data yet</h3>
              <p>Create bookings to see trip performance.</p>
            </div>
          ) : (
            <div className="top-trips-list">
              {topTrips.map((trip, index) => (
                <div className="top-trip-item" key={trip.trip}>
                  <div className="top-trip-rank">
                    {index + 1}
                  </div>

                  <div className="top-trip-info">
                    <h3>{trip.trip}</h3>
                    <span>
                      {trip.bookings}{" "}
                      {trip.bookings === 1
                        ? "booking"
                        : "bookings"}
                    </span>
                  </div>

                  <strong>
                    ₹{trip.revenue.toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Trip Inventory</h2>
              <p>Current trips available in TravelGo.</p>
            </div>
          </div>

          <div className="inventory-summary">
            <div>
              <span>Total Trips</span>
              <strong>{trips.length}</strong>
            </div>

            <div>
              <span>Upcoming</span>
              <strong>
                {
                  trips.filter(
                    (trip) => trip.status === "Upcoming"
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>Active</span>
              <strong>
                {
                  trips.filter(
                    (trip) => trip.status === "Active"
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>Completed</span>
              <strong>
                {
                  trips.filter(
                    (trip) => trip.status === "Completed"
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;