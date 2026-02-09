import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InfoMobileProps {
  totalPrice?: string;
}

export default function InfoMobile({ totalPrice = '$0.00' }: InfoMobileProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Registration Fee
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF5600' }}>
        Free
      </Typography>
    </Box>
  );
}

