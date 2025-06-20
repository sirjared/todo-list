import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Here you would typically clear any user session/auth state
    // For now, we'll just navigate to the landing page
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">MyDay</h1>
      </div>
      
      <div className="nav-section">
        <h2 className="nav-section-title">DAY</h2>
        <ul className="nav-list">
          <li 
            className={`nav-item ${activePage === 'planner' ? 'active' : ''}`}
            onClick={() => onNavigate('planner')}
          >
            <Link to="/app">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
              </svg>
              My Planner
            </Link>
          </li>
          <li 
            className={`nav-item ${activePage === 'daily-tasks' ? 'active' : ''}`}
            onClick={() => onNavigate('daily-tasks')}
          >
            <Link to="/daily-tasks">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Daily Task List
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-section">
        <h2 className="nav-section-title">WEEK</h2>
        <ul className="nav-list">
          <li 
            className={`nav-item ${activePage === 'weekly-review' ? 'active' : ''}`}
            onClick={() => onNavigate('weekly-review')}
          >
            <Link to="/weekly-review">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14H7v-2h3v2zm0-4H7v-2h3v2zm0-4H7V7h3v2zm7 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z"/>
              </svg>
              Weekly Review
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Spacer to push logout to bottom */}
      <div style={{ flexGrow: 1 }}></div>
      
      {/* Logout section */}
      <div className="nav-section logout-section">
        <ul className="nav-list">
          <li className="nav-item logout-item" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar; 