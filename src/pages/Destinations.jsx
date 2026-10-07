import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Globe2,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import Modal from '../components/common/Modal'
import defaultDestinations from '../data/destinations'
import './Destinations.css'

function Destinations () {
  const [destinations, setDestinations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('newest')
  const [deleteDestinationId, setDeleteDestinationId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    try {
      const savedDestinations = JSON.parse(
        localStorage.getItem('travelgo_destinations')
      )

      if (Array.isArray(savedDestinations) && savedDestinations.length > 0) {
        setDestinations(savedDestinations)
      } else {
        localStorage.setItem(
          'travelgo_destinations',
          JSON.stringify(defaultDestinations)
        )

        setDestinations(defaultDestinations)
      }
    } catch {
      localStorage.setItem(
        'travelgo_destinations',
        JSON.stringify(defaultDestinations)
      )

      setDestinations(defaultDestinations)
    }
  }, [])

  const openDeleteModal = id => {
    setDeleteDestinationId(id)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteDestinationId(null)
    setIsDeleteModalOpen(false)
  }

  const handleDelete = () => {
    const updatedDestinations = destinations.filter(
      destination => destination.id !== deleteDestinationId
    )

    setDestinations(updatedDestinations)

    localStorage.setItem(
      'travelgo_destinations',
      JSON.stringify(updatedDestinations)
    )

    closeDeleteModal()
  }

  const filteredDestinations = useMemo(() => {
    let result = [...destinations]

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()

      result = result.filter(
        destination =>
          destination.name?.toLowerCase().includes(search) ||
          destination.country?.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter(
        destination => destination.status === statusFilter
      )
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => Number(b.id) - Number(a.id))
    }

    if (sortOrder === 'oldest') {
      result.sort((a, b) => Number(a.id) - Number(b.id))
    }

    if (sortOrder === 'nameAZ') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (sortOrder === 'nameZA') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    }

    return result
  }, [destinations, searchTerm, statusFilter, sortOrder])

  const activeCount = destinations.filter(
    destination => destination.status === 'Active'
  ).length

  const inactiveCount = destinations.filter(
    destination => destination.status === 'Inactive'
  ).length

  return (
    <div className='destinations-page'>
      <div className='destinations-topbar'>
        <div>
          <span className='destinations-eyebrow'>
            TRAVEL MANAGEMENT
          </span>

          <h1>Destinations</h1>

          <p>
            Discover, organize and manage destinations for your travelers.
          </p>
        </div>

        <Link
          to='/destinations/create'
          className='create-destination-btn'
        >
          <Plus size={18} />
          Add Destination
        </Link>
      </div>

      <div className='destination-stats'>
        <div className='destination-stat'>
          <div className='destination-stat-icon blue'>
            <Globe2 size={20} />
          </div>

          <div>
            <span>Total Destinations</span>
            <strong>{destinations.length}</strong>
          </div>
        </div>

        <div className='destination-stat'>
          <div className='destination-stat-icon green'>
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className='destination-stat'>
          <div className='destination-stat-icon red'>
            <XCircle size={20} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      <div className='destinations-toolbar'>
        <div className='destination-search'>
          <Search size={18} />

          <input
            type='text'
            placeholder='Search destinations or countries...'
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>

        <div className='destination-filter'>
          <select
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value)}
          >
            <option value='All'>All Status</option>
            <option value='Active'>Active</option>
            <option value='Inactive'>Inactive</option>
          </select>
        </div>

        <div className='destination-filter'>
          <select
            value={sortOrder}
            onChange={event => setSortOrder(event.target.value)}
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='nameAZ'>Name: A to Z</option>
            <option value='nameZA'>Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className='destinations-section'>
        <div className='destinations-section-header'>
          <div>
            <h2>Explore Destinations</h2>

            <p>
              {filteredDestinations.length} destination
              {filteredDestinations.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className='destinations-empty'>
            <div className='destination-empty-visual'>
              <div className='empty-globe'>
                <Globe2 size={38} />
              </div>
            </div>

            <h3>
              {destinations.length === 0
                ? 'Start your destination collection'
                : 'No destinations found'}
            </h3>

            <p>
              {destinations.length === 0
                ? 'Add your first destination and start building your travel collection.'
                : 'Try changing your search or filter to find a destination.'}
            </p>

            {destinations.length === 0 && (
              <Link
                to='/destinations/create'
                className='empty-destination-btn'
              >
                <Plus size={17} />
                Add First Destination
              </Link>
            )}
          </div>
        ) : (
          <div className='destination-grid'>
            {filteredDestinations.map(destination => (
              <div
                className='destination-card'
                key={destination.id}
              >
                <div className='destination-image'>
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      onError={event => {
                        event.currentTarget.style.display = 'none'
                        const placeholder =
                          event.currentTarget.nextElementSibling

                        if (placeholder) {
                          placeholder.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className='destination-image-placeholder'
                    style={{
                      display: destination.image ? 'none' : 'flex'
                    }}
                  >
                    <MapPin size={32} />
                  </div>

                  <div className='destination-image-overlay' />

                  <span
                    className={`destination-status ${
                      destination.status?.toLowerCase()
                    }`}
                  >
                    {destination.status}
                  </span>

                  <div className='destination-location'>
                    <MapPin size={14} />
                    {destination.country}
                  </div>
                </div>

                <div className='destination-content'>
                  <h3>{destination.name}</h3>

                  <p>
                    {destination.description ||
                      'No description available.'}
                  </p>

                  <div className='destination-card-footer'>
                    <span className='destination-country'>
                      <MapPin size={14} />
                      {destination.country}
                    </span>

                    <div className='destination-actions'>
                      <Link
                        to={`/destinations/${destination.id}`}
                        className='destination-action view'
                        title='View Destination'
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        to={`/destinations/${destination.id}/edit`}
                        className='destination-action edit'
                        title='Edit Destination'
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        type='button'
                        className='destination-action delete'
                        title='Delete Destination'
                        onClick={() =>
                          openDeleteModal(destination.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title='Delete Destination?'
        message='Are you sure you want to delete this destination? This action cannot be undone.'
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        confirmText='Delete Destination'
        cancelText='Keep Destination'
      />
    </div>
  )
}

export default Destinations