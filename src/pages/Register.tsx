import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { RegisterFormData, registerSchema } from '../lib/validations/auth';
import PasswordStrengthIndicator from '../components/ui/password-strength-indicator';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    surname: '',
    gender: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    country_id: 0,
    verification_method: 'email',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value;
    setFormData({
      ...formData,
      [name]: newValue
    });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Validate form data
      const validationResult = registerSchema.safeParse(formData);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
        setLoading(false);
        return;
      }

      const response = await authService.register(formData);

      if (response.success && response.data) {
        localStorage.setItem('verification_data', JSON.stringify({
          login: formData.phone_number || formData.email,
          verification_method: 'email' // default to email since both are required
        }));

        navigate('/verify-otp', {
          state: {
            message: response.data.message,
            login: formData.phone_number || formData.email
          }
        });
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <img
              src="/lovable-uploads/NGC-Logo-2.png"
              alt="NGC Logo"
              className="mx-auto w-12 h-12 object-contain mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">
              Create Account
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    fieldErrors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {fieldErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                  Surname
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    fieldErrors.surname ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.surname}
                  onChange={handleChange}
                />
                {fieldErrors.surname && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.surname}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  fieldErrors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {fieldErrors.gender && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.gender}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  fieldErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="255718561495"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {fieldErrors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country_id"
                name="country_id"
                required
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  fieldErrors.country_id ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.country_id}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {fieldErrors.country_id && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.country_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="verification_method" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Method
              </label>
              <select
                id="verification_method"
                name="verification_method"
                required
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  fieldErrors.verification_method ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.verification_method}
                onChange={handleChange}
              >
                <option value="">Select Verification Method</option>
                <option value="email">Email</option>
                <option value="mobile">Mobile</option>
              </select>
              {fieldErrors.verification_method && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.verification_method}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <PasswordStrengthIndicator password={formData.password} />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    fieldErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                {fieldErrors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password_confirmation}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
