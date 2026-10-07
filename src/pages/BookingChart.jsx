import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./BookingChart.css";

const bookingData = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 180 },
  { month: "Mar", bookings: 150 },
  { month: "Apr", bookings: 240 },
  { month: "May", bookings: 210 },
  { month: "Jun", bookings: 320 },
  { month: "Jul", bookings: 280 },
  { month: "Aug", bookings: 360 },
  { month: "Sep", bookings: 310 },
  { month: "Oct", bookings: 420 },
  { month: "Nov", bookings: 390 },
  { month: "Dec", bookings: 480 }
];

function BookingChart() {
  return (
    <div className="booking-chart-card">

      <div className="chart-header">
        <div>
          <span className="chart-label">BOOKINGS</span>
          <h2>Booking Overview</h2>
          <p>Monthly booking performance</p>
        </div>

        <select className="chart-select" defaultValue="2026">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={bookingData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient
                id="bookingGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity={0.28}
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#bookingGradient)"
              animationBegin={200}
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default BookingChart;