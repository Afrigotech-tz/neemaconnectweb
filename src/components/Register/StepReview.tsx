import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { RegisterFormData } from '../../lib/validations/auth';

interface StepReviewProps {
  formData: RegisterFormData;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export default function StepReview({ formData, onSubmit, loading, error }: StepReviewProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Review Your Information
      </Typography>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {/* Personal Info Section */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Personal Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">First Name</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.first_name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Surname</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.surname}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Gender</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
              {formData.gender}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contact Info Section */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Contact Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Verification Method</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
              {formData.verification_method}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Phone Number</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.phone_number}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Country ID</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.country_id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Security Section */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Security
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Password</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {'•'.repeat(formData.password.length)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Confirm Password</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {'•'.repeat(formData.password_confirmation.length)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
      </Typography>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onSubmit}
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 86, 0, 0.35)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
        ) : null}
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </Box>
  );
}

