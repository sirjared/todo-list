import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>MyDay</h1>
          </div>
          <nav className="main-nav">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/register" className="signup-btn">Sign Up Free</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h2>Organize Your Day, Achieve More</h2>
            <p>A simple, intuitive task manager that helps you stay focused and productive.</p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">Get Started - Free Forever</Link>
              <Link to="/app" className="secondary-btn">Try Demo</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="app-preview">
              <div className="app-window">
                <div className="app-layout">
                  <div className="app-sidebar">
                    <div className="sidebar-header">
                      <h3>MyDay</h3>
                    </div>
                    <ul className="sidebar-nav">
                      <li className="active"><span className="nav-icon">📋</span> Planner</li>
                      <li><span className="nav-icon">📅</span> Daily Tasks</li>
                      <li><span className="nav-icon">📊</span> Weekly Review</li>
                    </ul>
                  </div>
                  <div className="app-main">
                    <div className="app-header">
                      <div className="date-nav">
                        <button className="nav-arrow">←</button>
                        <h3>Today</h3>
                        <button className="nav-arrow">→</button>
                      </div>
                      <button className="add-task">+ Add Task</button>
                    </div>
                    <div className="task-columns">
                      <div className="task-column">
                        <div className="column-header">
                          <h4>Monday, June 20</h4>
                        </div>
                        <div className="task-list">
                          <div className="task completed">
                            <input type="checkbox" checked readOnly />
                            <span>Morning team standup</span>
                          </div>
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Complete project proposal</span>
                          </div>
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Lunch with client</span>
                          </div>
                          <div className="task completed">
                            <input type="checkbox" checked readOnly />
                            <span>Send weekly report</span>
                          </div>
                        </div>
                      </div>
                      <div className="task-column">
                        <div className="column-header">
                          <h4>Tuesday, June 21</h4>
                        </div>
                        <div className="task-list">
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Design review meeting</span>
                          </div>
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Finalize Q3 roadmap</span>
                          </div>
                        </div>
                      </div>
                      <div className="task-column">
                        <div className="column-header">
                          <h4>Wednesday, June 22</h4>
                        </div>
                        <div className="task-list">
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Team lunch</span>
                          </div>
                          <div className="task">
                            <input type="checkbox" readOnly />
                            <span>Prepare presentation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Streamline Your Workflow</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Simple Task Management</h3>
              <p>Easily create, organize, and complete tasks with our intuitive interface. Stay on top of your daily responsibilities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Calendar Integration</h3>
              <p>Visualize your schedule with our built-in calendar view. Drag and drop tasks to plan your day efficiently.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Weekly Reviews</h3>
              <p>Reflect on your accomplishments and plan ahead with our weekly review feature. Track your productivity over time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Notes & Context</h3>
              <p>Add detailed notes to your tasks for additional context. Keep all your important information in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">Why MyDay?</h2>
            <p className="about-text">
              We created MyDay with a simple goal: to help you focus on what matters most. 
              Our clean, distraction-free interface helps you organize your tasks and time 
              without overwhelming you with unnecessary features.
            </p>
            <p className="about-text">
              MyDay is and always will be completely free. No premium tiers, no hidden costs, 
              no "pro" features locked behind paywalls. We believe everyone deserves access 
              to great productivity tools.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"MyDay has completely transformed how I manage my workload. The weekly review feature helps me stay accountable and focused on my goals."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Marketing Director</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"The calendar integration is a game-changer. I can easily schedule my coding tasks around meetings and see my day at a glance."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"As someone who wears many hats in my business, MyDay helps me prioritize and never miss important deadlines. It's simple yet powerful!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-info">
                  <h4>Amanda Rodriguez</h4>
                  <p>Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Organized?</h2>
          <p>Join thousands of users who have improved their productivity with MyDay.</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">Sign Up Now</Link>
            <Link to="/app" className="secondary-btn">Try Demo</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>MyDay</h3>
              <p>Simple, effective task management</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/app">Features</Link></li>
                  <li><a href="#about">About</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#testimonials">Testimonials</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 MyDay Made with Love by Fair App Corp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing; 