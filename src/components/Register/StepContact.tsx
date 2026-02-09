import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { ContactInfoData } from '../../lib/validations/auth';
import { Country } from '../../services/authService';

interface StepContactProps {
  formData: ContactInfoData;
  onChange: (data: ContactInfoData) => void;
  onValidationChange: (isValid: boolean) => void;
  countries: Country[];
}

export default function StepContact({ formData, onChange, onValidationChange, countries }: StepContactProps) {
  const handleChange = (field: keyof ContactInfoData, value: string | number) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  // Validation check - both phone and email required, regardless of verification method
  React.useEffect(() => {
    const hasCountry = formData.country_id > 0;
    const hasPhone = formData.phone_number.length >= 10;
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '');

    onValidationChange(hasCountry && hasPhone && hasEmail);
  }, [formData, onValidationChange]);

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
        {/* Verification Method */}
        <Grid size={12}>
          <TextField
            fullWidth
            id="verification_method"
            name="verification_method"
            label="Verification Method"
            select
            variant="outlined"
            value={formData.verification_method}
            onChange={(e) => handleChange('verification_method', e.target.value)}
            sx={inputStyles}
          >
            <MenuItem value="mobile">Mobile (SMS)</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </TextField>
        </Grid>

        {/* Country */}
        <Grid size={12}>
          <TextField
            fullWidth
            id="country_id"
            name="country_id"
            label="Country"
            select
            variant="outlined"
            value={formData.country_id}
            onChange={(e) => handleChange('country_id', Number(e.target.value))}
            sx={inputStyles}
          >
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name} ({country.dial_code})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Phone Number - Always required */}
        <Grid size={12}>
          <TextField
            fullWidth
            id="phone_number"
            name="phone_number"
            label="Phone Number"
            type="tel"
            variant="outlined"
            required
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            sx={inputStyles}
            placeholder="255718561495"
            helperText="Required for account verification"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Email - Always required */}
        <Grid size={12}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            sx={inputStyles}
            helperText="Required for account verification"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

