import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SitemarkIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        component="img"
        src="/lovable-uploads/NGC-Logo-2.png"
        alt="NGC Logo"
        sx={{
          width: 48,
          height: 48,
          objectFit: 'contain',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Neema Connect
      </Typography>
    </Box>
  );
}

