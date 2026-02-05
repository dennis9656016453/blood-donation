import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import RequestsList from '../../components/RequestsList'
import '../../styles/dashboard.css'

function BloodRequests({ role }) {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  // Determine role from Prop, URL or fallback
  const getRole = () => {
    if (role) return role;
    const paramRole = searchParams.get('role');
    if (paramRole && user?.roles?.includes(paramRole)) return paramRole;
    if (user?.roles?.includes('donor')) return 'donor';
    return 'recipient';
  }
  
  const currentRole = getRole();

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="dashboard-title">
              {currentRole === 'recipient' ? 'My Requests' : 'Blood Requests'}
            </h1>
            <p className="dashboard-subtitle">
              {currentRole === 'recipient' 
                ? 'Manage your blood creation requests' 
                : 'Browse and respond to blood donation requests'}
            </p>
          </div>
        </div>
        
        <RequestsList 
          showHeader={false} 
          showFilters={true} 
          role={currentRole}
        />
      </div>
    </div>
  )
}

export default BloodRequests
