import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/dashboard.css'
import DonorDashboard from './DonorDashboard'
import RecipientDashboard from './RecipientDashboard'
import { Check, Heart, User } from 'lucide-react'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Determine initial view based on roles and query param
  const hasRole = (role) => user?.roles && user.roles.includes(role)
  
  const getInitialRole = () => {
    const requestedRole = searchParams.get('role')
    if (requestedRole && hasRole(requestedRole)) return requestedRole;
    if (hasRole('donor')) return 'donor';
    if (hasRole('recipient')) return 'recipient';
    return 'donor'; // Fallback
  }

  const [currentRole, setCurrentRole] = useState(getInitialRole())

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam && hasRole(roleParam)) {
        setCurrentRole(roleParam)
    } else {
        if (!hasRole(currentRole)) {
            setCurrentRole(getInitialRole())
        }
    }
  }, [searchParams, user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
           <div>
             <h1 className="text-3xl font-bold text-gray-900 leading-tight">
               {getGreeting()}, <span className="text-red-600">{user?.name}</span>!
             </h1>
             <p className="text-gray-600 mt-2 text-lg">
               Welcome to your EDUDONOR dashboard 
             </p>
           </div>
           
           {/* Role Switcher */}
           {hasRole('donor') && hasRole('recipient') && (
               <div className="flex gap-2">
                   <button 
                    onClick={() => setSearchParams({ role: 'donor' })}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                        currentRole === 'donor' 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                    }`}
                   >
                       {currentRole === 'donor' && <Check className="w-4 h-4" />}
                       Donor View
                   </button>
                   <button 
                    onClick={() => setSearchParams({ role: 'recipient' })}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                        currentRole === 'recipient' 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                    }`}
                   >
                       {currentRole === 'recipient' && <Check className="w-4 h-4" />}
                       Recipient View
                   </button>
               </div>
           )}
           
           {/* Single Role Badge (if not switcher) */}
            {!(hasRole('donor') && hasRole('recipient')) && (
               <div className="flex items-center gap-3">
                   <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                       currentRole === 'donor' 
                       ? 'bg-red-50 text-red-700 border-red-100' 
                       : 'bg-blue-50 text-blue-700 border-blue-100'
                   }`}>
                       {currentRole === 'donor' ? 'Donor Portal' : 'Recipient Portal'}
                   </span>
                   
                   {!hasRole('recipient') && (
                       <button
                           onClick={async () => {
                               if(!confirm('Do you want to become a Recipient? This will allow you to request blood.')) return;
                               try {
                                   await authService.addRole('recipient');
                                   toast.success('You are now a Recipient! Reloading...');
                                   window.location.reload();
                               } catch (error) {
                                   toast.error('Failed to add role');
                               }
                           }}
                           className="px-4 py-2 rounded-lg text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                       >
                           <User size={16} />
                           Become a Recipient
                       </button>
                   )}

                   {!hasRole('donor') && (
                       <button
                           onClick={async () => {
                               if(!confirm('Do you want to become a Donor? This will allow you to access the donor portal.')) return;
                               try {
                                   await authService.addRole('donor');
                                   toast.success('You are now a Donor! Reloading...');
                                   window.location.reload();
                               } catch (error) {
                                   toast.error('Failed to add role');
                               }
                           }}
                           className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-600 text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
                       >
                           <Heart size={16} />
                           Become a Donor
                       </button>
                   )}
               </div>
           )}
        </div>

        {currentRole === 'donor' ? <DonorDashboard user={user} /> : <RecipientDashboard user={user} />}
      </div>
    </div>
  )
}

export default Dashboard
