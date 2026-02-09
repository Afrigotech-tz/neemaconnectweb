import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PasswordStrengthIndicatorProps {
  strength: number;
}

export default function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#d32f2f', '#d32f2f', '#f57c00', '#fbc02d', '#388e3c'];

  if (strength === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
        {[1, 2, 3, 4].map((index) => (
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
}

