import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z\d]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const strength = getStrength(password);
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#d32f2f', '#d32f2f', '#f57c00', '#fbc02d', '#388e3c'];

  if (!password) {
    return null;
  }

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: index <= strength ? colors[strength - 1] : 'grey.200',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{ color: colors[strength - 1], fontWeight: 500 }}
      >
        {labels[strength - 1]}
      </Typography>
    </Box>
  );
};

export default PasswordStrengthIndicator;

