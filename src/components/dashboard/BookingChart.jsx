import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import './BookingChart.css'

const bookingData = [
  {
    month: 'Jan',
    bookings: 120
  },
  {
    month: 'Feb',
    bookings: 180
  },
  {
    month: 'Mar',
    bookings: 150
  },
  {
    month: 'Apr',
    bookings: 240
  },
  {
    month: 'May',
    bookings: 210
  },
  {
    month: 'Jun',
    bookings: 320
  },
  {
    month: 'Jul',
    bookings: 280
  },
  {
    month: 'Aug',
    bookings: 360
  },
  {
    month: 'Sep',
    bookings: 310
  },
  {
    month: 'Oct',
    bookings: 420
  },
  {
    month: 'Nov',
    bookings: 390
  },
  {
    month: 'Dec',
    bookings: 480
  }
]

function BookingTooltip ({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className='booking-tooltip'>
      <span>{label}</span>
      <strong>{payload[0].value} Bookings</strong>
    </div>
  )
}

function BookingChart () {
  return (
    <div className='booking-chart-card'>

      <div className='chart-header'>

        <div className='chart-title-section'>
          <span className='chart-label'>
            BOOKINGS
          </span>

          <h2>
            Booking Overview
          </h2>

          <p>
            Monthly booking performance
          </p>
        </div>

        <select
          className='chart-select'
          defaultValue='2026'
          aria-label='Select year'
        >
          <option value='2026'>
            2026
          </option>

          <option value='2025'>
            2025
          </option>

          <option value='2024'>
            2024
          </option>
        </select>

      </div>

      <div className='chart-summary'>

        <div className='chart-total'>
          <span>Total Bookings</span>
          <strong>856</strong>
        </div>

        <div className='chart-growth'>
          <span className='growth-dot'></span>
          <span>15.4% growth</span>
        </div>

      </div>

      <div className='chart-container'>

        <ResponsiveContainer
          width='100%'
          height='100%'
        >
          <AreaChart
            data={bookingData}
            margin={{
              top: 15,
              right: 10,
              left: -18,
              bottom: 0
            }}
          >

            <defs>

              <linearGradient
                id='bookingGradient'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='#c9972b'
                  stopOpacity={0.32}
                />

                <stop
                  offset='55%'
                  stopColor='#c9972b'
                  stopOpacity={0.12}
                />

                <stop
                  offset='100%'
                  stopColor='#c9972b'
                  stopOpacity={0.02}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#e8dfcf'
            />

            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#7b8088',
                fontSize: 11
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#7b8088',
                fontSize: 11
              }}
              width={42}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
            />

            <Tooltip
              content={<BookingTooltip />}
              cursor={{
                stroke: '#c9972b',
                strokeWidth: 1,
                strokeDasharray: '4 4'
              }}
            />

            <Area
              type='monotone'
              dataKey='bookings'
              stroke='#c9972b'
              strokeWidth={3}
              fill='url(#bookingGradient)'
              activeDot={{
                r: 5,
                fill: '#c9972b',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              animationBegin={200}
              animationDuration={1400}
              animationEasing='ease-out'
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default BookingChart