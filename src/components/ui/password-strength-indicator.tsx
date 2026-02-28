<<<<<<< HEAD
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

=======
import React from 'react';

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
    return strength;
  };

  const strength = getStrength(password);
  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'text-red-500';
    if (strength <= 3) return 'text-yellow-500';
    if (strength <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  if (!password) return null;

  return (
    <div className="mt-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 w-6 rounded ${
              level <= strength
                ? strength <= 2
                  ? 'bg-red-500'
                  : strength <= 3
                  ? 'bg-yellow-500'
                  : strength <= 4
                  ? 'bg-blue-500'
                  : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 ${getStrengthColor()}`}>
        {getStrengthText()}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
>>>>>>> live
