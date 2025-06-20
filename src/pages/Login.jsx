import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Login.css';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Reset any previous errors
    setLoginError('');
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === data.email);
    
    if (user && user.password === btoa(data.password)) {
      // Set logged in user in localStorage
      localStorage.setItem('loggedInUser', data.email);
      // Redirect to app
      navigate('/app');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Yellow ribbon */}
      <div className="bg-yellow-300 py-3 text-center font-semibold">
        Free Forever! Plan & Conquer Your Day 🎉
      </div>
      
      {/* Header with logo */}
      <header className="container mx-auto px-4 py-6">
        <Link to="/" className="text-3xl font-bold text-blue-600">MyDay</Link>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Log In
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link to="/app" className="text-blue-600 hover:text-blue-800">
              Try without an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login; 