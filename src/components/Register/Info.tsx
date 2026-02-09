import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InfoProps {
  totalPrice?: string;
  personalData?: {
    first_name: string;
    surname: string;
    gender: string;
  };
  contactData?: {
    verification_method: string;
    phone_number?: string;
    email?: string;
    country_id: number;
  };
}

export default function Info({ totalPrice = '$0.00', personalData, contactData }: InfoProps) {
  const steps = [
    { label: 'Personal Information', icon: PersonIcon, completed: !!personalData },
    { label: 'Contact Details', icon: contactData?.verification_method === 'mobile' ? PhoneIcon : EmailIcon, completed: !!contactData?.phone_number || !!contactData?.email },
    { label: 'Security Setup', icon: LockIcon, completed: false },
    { label: 'Account Created', icon: CheckCircleIcon, completed: false },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        maxWidth: 500,
      }}
    >
      {/* Progress Steps */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Registration Progress
      </Typography>
      <List>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <ListItem
              key={step.label}
              sx={{
                px: 0,
                py: 1,
                opacity: step.completed ? 1 : 0.6,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon sx={{ color: step.completed ? '#FF5600' : 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText
                primary={step.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: step.completed ? 600 : 400,
                  color: step.completed ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Summary */}
      <Box
        sx={{
          mt: 'auto',
          pt: 4,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ready to join NGC?
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF5600' }}>
          Free
        </Typography>
        <Typography variant="caption" color="text.secondary">
          No payment required for registration
        </Typography>
      </Box>
    </Box>
  );
}

