import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// MUI Icons
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import ShopIcon from '@mui/icons-material/Shop';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

// Services and Hooks
import { authService, Country } from '../services/authService';
import { RegisterFormData, PersonalInfoData, ContactInfoData, SecurityData } from '../lib/validations/auth';

// Step Components
import StepPersonal from '../components/Register/StepPersonal';
import StepContact from '../components/Register/StepContact';
import StepSecurity from '../components/Register/StepSecurity';
import Info from '../components/Register/Info';
import InfoMobile from '../components/Register/InfoMobile';
import SitemarkIcon from '../components/Register/SitemarkIcon';

const steps = ['Personal Info', 'Contact Details', 'Security'];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'PersonalInfo';
    case 1:
      return 'ContactInfo';
    case 2:
      return 'Security';
    default:
      throw new Error('Unknown step');
  }
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Step validation states
  const [personalValid, setPersonalValid] = useState(false);
  const [contactValid, setContactValid] = useState(false);
  const [securityValid, setSecurityValid] = useState(false);
  
  // Form data states
  const [personalData, setPersonalData] = useState<PersonalInfoData>({
    first_name: '',
    surname: '',
    gender: '',
  });
  
  const [contactData, setContactData] = useState<ContactInfoData>({
    verification_method: 'mobile',
    phone_number: '',
    email: '',
    country_id: 1,
  });
  
  const [securityData, setSecurityData] = useState<SecurityData>({
    password: '',
    password_confirmation: '',
    country_id: 0,
    verification_method: 'email',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const mockCountries: Country[] = [
          { id: 1, name: 'Tanzania', code: 'TZ', dial_code: '+255', created_at: '', updated_at: '' },
          { id: 2, name: 'Kenya', code: 'KE', dial_code: '+254', created_at: '', updated_at: '' },
          { id: 3, name: 'Uganda', code: 'UG', dial_code: '+256', created_at: '', updated_at: '' },
          { id: 4, name: 'United States', code: 'US', dial_code: '+1', created_at: '', updated_at: '' },
          { id: 5, name: 'United Kingdom', code: 'GB', dial_code: '+44', created_at: '', updated_at: '' },
        ];
        setCountries(mockCountries);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      }
    };
    fetchCountries();
  }, []);

  // Combine all form data - ensure no null values for database
  const getFullFormData = (): RegisterFormData => {
    const baseData = {
      ...personalData,
      ...contactData,
      ...securityData,
    };
    
    // Ensure phone and email are never null for database
    const data = baseData as RegisterFormData;
    
    // If verification_method is 'mobile', phone is required, email can be empty string
    // If verification_method is 'email', email is required, phone can be empty string
    // But database doesn't allow NULL, so we send empty string as placeholder
    
    return {
      ...data,
      phone_number: data.phone_number || '',
      email: data.email || '',
    };
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const fullData = getFullFormData();
      const response = await authService.register(fullData);

      if (response.success && response.data) {
        localStorage.setItem('verification_data', JSON.stringify({
          login: contactData.phone_number || contactData.email,
          verification_method: contactData.verification_method,
        }));

        navigate('/verify-otp', {
          state: {
            message: response.data.message,
            login: contactData.phone_number || contactData.email,
          },
        });
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return personalValid;
      case 1:
        return contactValid;
      case 2:
        return securityValid;
      default:
        return false;
    }
  };

  const stats = [
    { value: '10K+', label: 'Users' },
    { value: '5K+', label: 'Events' },
    { value: '500+', label: 'Artists' },
  ];

  const featureItems = [
    { icon: <EventIcon />, title: 'Exclusive Events', subtitle: 'Concerts & meetups' },
    { icon: <ShopIcon />, title: 'Official Merch', subtitle: 'Wear your vibe' },
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
      {/* Left Sidebar - Welcome Content */}
      <Box
        sx={{
          flex: { xs: 'none', lg: '0 0 45%' },
          height: { xs: 320, lg: '100vh' },
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          position: 'relative',
          overflow: 'hidden',
          order: { xs: 2, lg: 1 },
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
            animation: mounted ? 'pulse 4s ease-in-out infinite' : 'none',
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
            animation: mounted ? 'pulse 5s ease-in-out infinite reverse' : 'none',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            px: 3,
            maxWidth: 480,
            position: 'relative',
            zIndex: 1,
            animation: mounted ? 'fadeSlideIn 0.7s ease-out 0.2s both' : 'none',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
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
                style={{ width: 65, height: 65, objectFit: 'contain' }}
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
            Join Neema Connect
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
            Create your account and unlock exclusive features
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 4 }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: '#FF5600', fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.7, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Features */}
          <Box sx={{ textAlign: 'left', maxWidth: 360, mx: 'auto', mb: 4 }}>
            {featureItems.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 86, 0, 0.1)',
                      borderColor: 'rgba(255, 86, 0, 0.3)',
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
                    {React.cloneElement(item.icon as React.ReactElement, {
                      sx: { fontSize: 22, color: '#FF5600' },
                    })}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', opacity: 0.7 }}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Social Proof */}
          <Box sx={{ pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} sx={{ fontSize: 18, color: '#FFD700' }} />
              ))}
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
              Join thousands of music lovers & event enthusiasts
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Registration Form */}
      <Box
        sx={{
          flex: { xs: 1, lg: '0 0 55%' },
          height: { xs: 'auto', lg: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#fff',
          order: { xs: 1, lg: 2 },
          position: 'relative',
          zIndex: 2,
          py: { xs: 4, sm: 5, lg: 0 },
          px: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ maxWidth: 520, mx: 'auto', width: '100%' }}>
          {/* Logo for Mobile */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF5600 0%, #ff7b00 100%)',
                boxShadow: '0 4px 15px rgba(255, 86, 0, 0.3)',
              }}
            >
              <img
                src="/lovable-uploads/NGC-Logo-2.png"
                alt="NGC Logo"
                style={{ width: 38, height: 38, objectFit: 'contain' }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Box sx={{ mb: 4 }}>
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
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 0.5, fontSize: '0.95rem' }}>
              Join Neema Connect today
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
                '& .MuiAlert-message': { fontSize: '0.875rem' },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Mobile Summary Card */}
          <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', mb: 3 }}>
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {steps[activeStep]}
                </Typography>
              </Box>
              <InfoMobile />
            </CardContent>
          </Card>

          {/* Step Content */}
          {getStepContent(activeStep) === 'PersonalInfo' && (
            <StepPersonal
              formData={personalData}
              onChange={setPersonalData}
              onValidationChange={setPersonalValid}
            />
          )}
          
          {getStepContent(activeStep) === 'ContactInfo' && (
            <StepContact
              formData={contactData}
              onChange={setContactData}
              onValidationChange={setContactValid}
              countries={countries}
            />
          )}
          
          {getStepContent(activeStep) === 'Security' && (
            <StepSecurity
              formData={securityData}
              onChange={setSecurityData}
              onValidationChange={setSecurityValid}
            />
          )}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: 'end',
              gap: 1,
              mt: 4,
              pb: 4,
            }}
          >
            {activeStep !== 0 && (
              <>
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="text"
                  sx={{ display: { xs: 'none', sm: 'flex' }, color: '#666' }}
                >
                  Previous
                </Button>
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="outlined"
                  fullWidth
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  Previous
                </Button>
              </>
            )}
            <Button
              variant="contained"
              endIcon={activeStep === steps.length - 1 ? undefined : <ChevronRightRoundedIcon />}
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={!isStepValid(activeStep) || loading}
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
                width: { xs: '100%', sm: 'fit-content' },
                ml: { sm: activeStep !== 0 ? 'auto' : 0 },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              ) : null}
              {loading ? 'Creating account...' : activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
            </Button>
          </Box>

          {/* Login Link */}
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF5600', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Global Styles */}
      <style>
        {`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
};

export default Register;

