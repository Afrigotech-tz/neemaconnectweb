import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import { PersonalInfoData } from '../../lib/validations/auth';

interface StepPersonalProps {
  formData: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function StepPersonal({ formData, onChange, onValidationChange }: StepPersonalProps) {
  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  // Simple validation check
  React.useEffect(() => {
    const isValid = 
      formData.first_name.length >= 2 && 
      formData.surname.length >= 2 && 
      (formData.gender === 'male' || formData.gender === 'female');
    onValidationChange(isValid);
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="first_name"
            name="first_name"
            label="First Name"
            type="text"
            variant="outlined"
            required
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="surname"
            name="surname"
            label="Surname"
            type="text"
            variant="outlined"
            required
            value={formData.surname}
            onChange={(e) => handleChange('surname', e.target.value)}
            sx={inputStyles}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            select
            variant="outlined"
            required
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            sx={inputStyles}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

