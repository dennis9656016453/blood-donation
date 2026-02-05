import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, addDays } from 'date-fns'
import { useNotifications } from '../../contexts/NotificationContext'
import { donorService } from '../../services/donor.service'
import { campService } from '../../services/camp.service'
import {
  Droplets,
  Heart,
  Users,
  Calendar,
  Bell,
  Clock,
  AlertCircle
} from 'lucide-react'
import RequestsList from '../../components/RequestsList'

function DonorDashboard({ user }) {
  const { unreadCount } = useNotifications()
  const [stats, setStats] = useState({})
  const [upcomingCamps, setUpcomingCamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileIncomplete, setProfileIncomplete] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)

    try {
      // Fetch donor profile
      const statsRes = await donorService.getProfile().catch(err => {
        if (err.response?.status === 404) return { donor: null }
        throw err
      })

      // Fetch camps
      const campsRes = await campService.getUpcomingCamps(3).catch(err => ({ camps: [] }))

      // Handle stats
      if (statsRes && statsRes.donor) {
        const donor = statsRes.donor
        setStats({
          totalDonations: donor.totalDonations || 0,
          lastDonation: donor.lastDonationDate,
          isEligible: donor.isEligible,
          isAvailable: donor.isAvailable
        })
      } else {
        setProfileIncomplete(true)
        setStats({
          totalDonations: 0,
          lastDonation: null,
          isEligible: false,
          isAvailable: false
        })
      }

      // Handle camps
      setUpcomingCamps(campsRes.camps || [])

    } catch (error) {
      console.error("Dashboard data fetch error", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        {/* Profile Incomplete Alert */}
        {profileIncomplete && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
             <div className="flex items-start">
               <div className="flex-shrink-0">
                 <AlertCircle className="h-5 w-5 text-yellow-400" />
               </div>
               <div className="ml-3 flex-1">
                 <h3 className="text-sm font-medium text-yellow-800">
                   Complete Your Donor Profile
                 </h3>
                 <div className="mt-2 text-sm text-yellow-700">
                   <p>
                     You need to complete your donor profile before you can view blood requests and participate in donations.
                     Please provide your blood group, medical information, and other required details.
                   </p>
                 </div>
                 <div className="mt-4">
                   <Link
                     to="/dashboard/profile"
                     className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors"
                   >
                     Complete Profile Now
                   </Link>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-red">
                <Droplets className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-text">
                <p className="dashboard-stat-label">Total Donations</p>
                <p className="dashboard-stat-value">{stats.totalDonations || 0}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-green">
                <Clock className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-text w-full">
                <p className="dashboard-stat-label">Next Eligibility</p>
                {stats.isEligible ? (
                  <p className="dashboard-stat-value text-green-600 text-lg">Available Now</p>
                ) : (
                  <div className="flex flex-col mt-1">
                    <span className="text-xs text-gray-500 uppercase font-bold">
                       {stats.lastDonation && format(addDays(new Date(stats.lastDonation), 90), 'MMM yyyy')}
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {stats.lastDonation && format(addDays(new Date(stats.lastDonation), 90), 'd')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {stats.lastDonation && format(addDays(new Date(stats.lastDonation), 90), 'EEEE')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-blue">
                <Bell className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-text">
                <p className="dashboard-stat-label">Notifications</p>
                <p className="dashboard-stat-value">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-icon dashboard-stat-icon-yellow">
                <Calendar className="dashboard-stat-icon-svg" />
              </div>
              <div className="dashboard-stat-text">
                <p className="dashboard-stat-label">Upcoming Camps</p>
                <p className="dashboard-stat-value">{upcomingCamps.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card h-fit">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Donor Actions</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Update Profile</h3>
                      <p className="text-sm text-gray-600">Manage your donor information</p>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard/available-requests"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">View Blood Requests</h3>
                      <p className="text-sm text-gray-600">See requests matching your blood type</p>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard/donations"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Donation History</h3>
                      <p className="text-sm text-gray-600">Track and verify your donations</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/camps"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Donation Camps</h3>
                    </div>
                  </Link>
              </div>
            </div>
          </div>

          {/* Blood Requests List */}
          <div>
             <RequestsList 
                limit={1} 
                showHeader={true} 
                showFilters={false} 
                showViewAll={true}
                role="donor"
             />
          </div>
        </div>

        {/* Upcoming Donation Camps */}
        {upcomingCamps.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Donation Camps</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingCamps.map((camp) => (
                    <div key={camp._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{camp.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{camp.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(camp.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {camp.location.city}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/camps/${camp._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default DonorDashboard
