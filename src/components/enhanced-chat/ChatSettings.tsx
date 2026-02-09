import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PaletteIcon from '@mui/icons-material/Palette';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const ChatSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
    responseSpeed: 50,
    cognitiveMode: 'balanced',
    privacyMode: false,
    theme: 'light',
    language: 'en',
    maxTokens: 1000,
    temperature: 0.7
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Save settings to backend/localStorage
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cognitiveModes = [
    { value: 'conservative', label: 'Conservative', desc: 'Slower, more thoughtful responses' },
    { value: 'balanced', label: 'Balanced', desc: 'Standard response speed and creativity' },
    { value: 'aggressive', label: 'Aggressive', desc: 'Faster, more creative responses' }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Chat Settings
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Customize your AI assistant experience and cognitive enhancement preferences.
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Audio & Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <VolumeUpIcon />
                </Avatar>
                <Typography variant="h6">Audio & Notifications</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {settings.soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                      <Typography>Sound Effects</Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationsEnabled}
                      onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {settings.notificationsEnabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
                      <Typography>Notifications</Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Auto-save conversations"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cognitive Enhancement */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <PsychologyIcon />
                </Avatar>
                <Typography variant="h6">Cognitive Enhancement</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Response Speed
                  </Typography>
                  <Slider
                    value={settings.responseSpeed}
                    onChange={(_, value) => handleSettingChange('responseSpeed', value)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: 'Slow' },
                      { value: 50, label: 'Normal' },
                      { value: 100, label: 'Fast' }
                    ]}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Cognitive Mode
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {cognitiveModes.map((mode) => (
                      <Box
                        key={mode.value}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: settings.cognitiveMode === mode.value ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          cursor: 'pointer',
                          bgcolor: settings.cognitiveMode === mode.value ? 'primary.light' : 'transparent',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => handleSettingChange('cognitiveMode', mode.value)}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {mode.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {mode.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <SpeedIcon />
                </Avatar>
                <Typography variant="h6">Advanced Settings</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Tokens"
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                    helperText="Maximum response length"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Temperature"
                    type="number"
                    inputProps={{ min: 0, max: 2, step: 0.1 }}
                    value={settings.temperature}
                    onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                    helperText="Creativity level (0-2)"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy & Security */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6">Privacy & Security</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacyMode}
                    onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography>Enhanced Privacy Mode</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Encrypt conversations and limit data sharing
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          sx={{ px: 4 }}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default ChatSettings;
