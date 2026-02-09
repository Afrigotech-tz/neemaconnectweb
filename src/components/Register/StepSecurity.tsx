import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PasswordStrengthIndicator from '../ui/password-strength-indicator';
import { SecurityData } from '../../lib/validations/auth';

interface StepSecurityProps {
  formData: SecurityData;
  onChange: (data: SecurityData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function StepSecurity({ formData, onChange, onValidationChange }: StepSecurityProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const handleChange = (field: keyof SecurityData, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    return Math.min(strength, 4);
  };

  // Validation check
  React.useEffect(() => {
    const isValidPassword = 
      formData.password.length >= 8 && 
      /[a-z]/.test(formData.password) && 
      /[A-Z]/.test(formData.password) && 
      /\d/.test(formData.password);
    
    const isValid = isValidPassword && formData.password === formData.password_confirmation;
    onValidationChange(isValid);
  }, [formData, onValidationChange]);

  const handlePasswordChange = (value: string) => {
    handleChange('password', value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const inputStyles = {
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
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            required
            value={formData.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" sx={{ fontSize: 20 }} />
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
          />
          <PasswordStrengthIndicator strength={passwordStrength} />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            id="password_confirmation"
            name="password_confirmation"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            required
            value={formData.password_confirmation}
            onChange={(e) => handleChange('password_confirmation', e.target.value)}
            sx={inputStyles}
            error={formData.password_confirmation.length > 0 && formData.password !== formData.password_confirmation}
            helperText={
              formData.password_confirmation.length > 0 && formData.password !== formData.password_confirmation
                ? "Passwords don't match"
                : undefined
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

