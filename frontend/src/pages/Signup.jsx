import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl mb-4">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm mt-2">Join Team Task Manager today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
              {localError}
            </div>
          )}

          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full mt-4 py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
