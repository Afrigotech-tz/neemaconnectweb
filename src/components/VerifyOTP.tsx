import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';

// MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

// Services and Hooks
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const VerifyOTP: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const verificationData = JSON.parse(localStorage.getItem('verification_data') || '{}');
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
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loginValue, navigate]);

  const startResendTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
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
        const userWithPermissions = { ...user, permissions };
        authLogin(userWithPermissions, token);
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
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(errorMessage);
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 440,
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          animation: mounted ? 'fadeSlideIn 0.5s ease-out' : 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF5600 0%, #ff7b00 100%)',
              mb: 2,
              boxShadow: '0 4px 15px rgba(255, 86, 0, 0.3)',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Verify OTP
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sent to: <strong>{loginValue}</strong>
          </Typography>
        </Box>

        {/* Error/Success Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
              border: '1px solid rgba(211, 47, 47, 0.2)',
            }}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(56, 142, 60, 0.08)',
              border: '1px solid rgba(56, 142, 60, 0.2)',
            }}
          >
            {success}
          </Alert>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mb: 4,
            }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    padding: '12px 0',
                  },
                }}
                sx={{
                  width: 52,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF5600',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF5600',
                      boxShadow: '0 0 0 3px rgba(255, 86, 0, 0.1)',
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || otp.join('').length !== 6}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #FF5600 0%, #ff7b00 100%)',
              boxShadow: '0 4px 15px rgba(255, 86, 0, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #e64d00 0%, #ff6e00 100%)',
                boxShadow: '0 6px 20px rgba(255, 86, 0, 0.4)',
              },
              '&:disabled': {
                background: '#ccc',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
            ) : null}
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        {/* Resend OTP */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          {resendTimer > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Resend OTP in <strong>{resendTimer}</strong> seconds
            </Typography>
          ) : (
            <Button
              type="button"
              variant="text"
              onClick={handleResendOTP}
              disabled={resendLoading}
              sx={{
                color: '#FF5600',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 86, 0, 0.08)',
                },
                '&:disabled': {
                  color: '#999',
                },
              }}
              startIcon={<RefreshIcon />}
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          )}
        </Box>

        {/* Back to Login */}
        <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#FF5600',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>

      <style>
        {`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default VerifyOTP;

