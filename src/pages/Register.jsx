import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2 } from 'lucide-react';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      await registerUser(data.email, data.password, data.name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Create a new account</h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label-text" htmlFor="name">Full Name</label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="email">Email address</label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="password">Password</label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`input-field ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="confirmPassword">Confirm Password</label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`input-field ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center btn-primary py-2.5"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
