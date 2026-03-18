import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';

// MUI Icons
import {
  Visibility,
  VisibilityOff,
  Phone as PhoneIcon,
  Lock as LockIcon,
  MusicNote as MusicIcon,
  Event as EventIcon,
  ShoppingBag as ShopIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

// Services and Hooks
import { authService } from '../services/authService/authService';
import { useAuth } from '@/hooks/useAuth';

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 1.5,
      borderRadius: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        background: 'rgba(255, 86, 0, 0.1)',
        borderColor: 'rgba(255, 86, 0, 0.3)',
        transform: 'translateX(4px)',
      },
    }}
  >
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(255, 86, 0, 0.2) 0%, rgba(255, 140, 0, 0.2) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon as React.ReactElement, {
        sx: { fontSize: 22, color: '#FF5600' },
      })}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.7rem',
          opacity: 0.7,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
    <ArrowIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
  </Box>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for verification success message
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state after displaying
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.login, formData.password);

      if (response.success && response.data) {
        const { user, token, permissions } = response.data;

        if (user.status === 'inactive') {
          localStorage.setItem('verification_data', JSON.stringify({
            login: formData.login,
            verification_method: user.verification_method,
          }));

          navigate('/verify-otp', {
            state: {
              message: 'Please verify your account to continue',
              login: formData.login,
            },
          });
        } else {
          const userWithPermissions = { ...user, permissions };
          login(userWithPermissions, token);
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    { icon: <MusicIcon />, title: 'Discover African Music', subtitle: 'Stream & download' },
    { icon: <EventIcon />, title: 'Exclusive Events', subtitle: 'Concerts & meetups' },
    { icon: <ShopIcon />, title: 'Official Merch', subtitle: 'Wear your vibe' },
  ];

  const stats = [
    { value: '10K+', label: 'Users' },
    { value: '5K+', label: 'Events' },
    { value: '500+', label: 'Artists' },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
      }}
    >
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 'none', lg: '0 0 50%' },
          height: { xs: 'auto', lg: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#fff',
          order: { xs: 1, lg: 1 },
          position: 'relative',
          zIndex: 2,
          py: { xs: 4, sm: 5, lg: 0 },
          px: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            width: '100%',
            animation: mounted ? 'fadeSlideIn 0.5s ease-out' : 'none',
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF5600 0%, #ff7b00 100%)',
                mb: 2.5,
                boxShadow: '0 4px 15px rgba(255, 86, 0, 0.3)',
              }}
            >
              <img
                src="/lovable-uploads/NGC-Logo-2.png"
                alt="NGC Logo"
                style={{
                  width: 38,
                  height: 38,
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#1a1a2e',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mt: 0.5,
                fontSize: '0.95rem',
              }}
            >
              Sign in to continue to Neema Connect
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(56, 142, 60, 0.08)',
                border: '1px solid rgba(56, 142, 60, 0.2)',
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {success}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="login"
              name="login"
              label="Phone Number or Email"
              type="text"
              variant="outlined"
              required
              value={formData.login}
              onChange={handleChange}
              sx={{
                mb: 2.5,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ fontSize: 22, color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              placeholder="255743871360 or email@example.com"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{
                mb: 1.5,
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 22, color: '#999' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: '#999' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your password"
            />

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                to="/forgot-password"
                style={{
                  color: '#FF5600',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
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
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#ccc',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    mr: 1,
                  }}
                />
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#666',
              mt: 3,
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#FF5600',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Welcome Content */}
      <Box
        sx={{
          flex: { xs: 'none', lg: '0 0 50%' },
          height: { xs: 320, lg: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          position: 'relative',
          overflow: 'hidden',
          order: { xs: 2, lg: 2 },
          py: { xs: 4, lg: 0 },
          px: { xs: 2, lg: 0 },
        }}
      >
        {/* Decorative Background */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 86, 0, 0.15) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 140, 0, 0.12) 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite reverse',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            px: 3,
            maxWidth: 520,
            position: 'relative',
            zIndex: 1,
            animation: mounted ? 'fadeSlideIn 0.7s ease-out 0.2s both' : 'none',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <img
                src="/lovable-uploads/NGC-Logo-22.png"
                alt="NGC Logo"
                style={{
                  width: 65,
                  height: 65,
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>

          {/* Welcome Text */}
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              mb: 1.5,
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #fff 0%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Neema Connect
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              fontWeight: 400,
              opacity: 0.9,
              mb: 4,
            }}
          >
            Your Gateway to African Entertainment
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 5,
              mb: 4,
            }}
          >
            {stats.map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#FF5600',
                    fontSize: { xs: '1.1rem', md: '1.5rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Features */}
          <Box
            sx={{
              textAlign: 'left',
              maxWidth: 380,
              mx: 'auto',
            }}
          >
            {featureItems.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <FeatureCard icon={item.icon} title={item.title} subtitle={item.subtitle} />
              </Box>
            ))}
          </Box>

          {/* Social Proof */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5,
                mb: 1.5,
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  sx={{
                    fontSize: 18,
                    color: '#FFD700',
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: '0.85rem',
              }}
            >
              Join thousands of music lovers & event enthusiasts
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Global Styles */}
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
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;

