import { ArrowUpRight } from 'lucide-react'
import './StatCard.css'

function StatCard ({ title, value, change, icon: Icon, trend = [] }) {
  const maxValue = Math.max(...trend, 1)
  const points = trend
    .map((value, index) => {
      const x = (index / Math.max(trend.length - 1, 1)) * 100
      const y = 28 - (value / maxValue) * 22
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className='stat-card'>

      <div className='stat-card-top'>

        <div className='stat-icon'>
          <Icon size={20} />
        </div>

        <span className='stat-change'>
          <ArrowUpRight size={13} />
          {change}
        </span>

      </div>

      <div className='stat-info'>
        <span>{title}</span>
        <h3>{value}</h3>
      </div>

      <svg
        className='stat-sparkline'
        viewBox='0 0 100 30'
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        <polyline
          points={points}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>

    </div>
  )
}

export default StatCard