import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

interface VerificationData {
  login: string;
  verification_method: 'mobile' | 'email';
}

const VerifyOTP: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verificationData: VerificationData = JSON.parse(localStorage.getItem('verification_data') || '{}');
  const loginValue = location.state?.login || verificationData.login;
  const message = location.state?.message || 'Please enter the OTP sent to your device';

  useEffect(() => {
    if (!loginValue) {
      navigate('/login');
      return;
    }

    // Start resend timer
    startResendTimer();

    // Auto-focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [loginValue, navigate]);

  const startResendTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(timer);
  }, []); // Removed timerInterval from deps to avoid stale closure

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Allow only numeric input
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/[^0-9]/g, '').split('').slice(0, 6);
    
    if (numbers.length === 6) {
      setOtp(numbers);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOTP(loginValue, otpCode);

      if (response.success && response.data) {
        const { user, token, permissions } = response.data;
        localStorage.removeItem('verification_data');
        // Merge permissions into user object for RBAC
        const userWithPermissions = { ...user, permissions };
        login(userWithPermissions, token);
        navigate('/login', {
          state: {
            message: 'Account verified successfully! Please login to continue.',
            verified: true
          }
        });
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.resendOTP(loginValue);

      if (response.success) {
        setSuccess(response.message || 'OTP resent successfully');
        startResendTimer();
      } else {
        setError(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <p className="mt-1 text-sm text-gray-500">Sent to: {loginValue}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                id={`otp-${index}`}
                type="text"
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                pattern="[0-9]*"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-600">Resend OTP in {resendTimer} seconds</p>
            ) : (
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </form>

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
