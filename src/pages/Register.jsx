import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Register.css';

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();
  
  const password = watch('password', '');
  
  const onSubmit = (data) => {
    // Reset any previous errors
    setRegisterError('');
    
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(user => user.email === data.email);
      
      if (userExists) {
        setRegisterError('Email already registered');
        return;
      }
      
      // Store new user
      const newUser = {
        email: data.email,
        password: btoa(data.password) // Simple encoding, not secure for production
      };
      
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
      console.error('Registration error:', error);
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
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
          
          {registerError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {registerError}
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[0-9]).{6,}$/,
                    message: 'Password must contain at least one number'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Register
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Log In
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

export default Register; 