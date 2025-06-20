import { Link } from 'react-router-dom';

function Sidebar({ activePage, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">MyDay</h1>
      </div>
      
      <div className="nav-section">
        <h2 className="nav-section-title">Day</h2>
        <ul className="nav-list">
          <li 
            className={`nav-item ${activePage === 'planner' ? 'active' : ''}`}
            onClick={() => onNavigate('planner')}
          >
            <Link to="/app">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              My Planner
            </Link>
          </li>
          <li 
            className={`nav-item ${activePage === 'daily-tasks' ? 'active' : ''}`}
            onClick={() => onNavigate('daily-tasks')}
          >
            <Link to="/daily-tasks">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M18 9l-1.4-1.4-6.6 6.6-2.6-2.6L6 13l4 4z"/>
              </svg>
              Daily Task List
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-section">
        <h2 className="nav-section-title">Week</h2>
        <ul className="nav-list">
          <li 
            className={`nav-item ${activePage === 'weekly-review' ? 'active' : ''}`}
            onClick={() => onNavigate('weekly-review')}
          >
            <Link to="/weekly-review">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Weekly Review
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar; 