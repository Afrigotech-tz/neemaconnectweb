import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  status: 'active' | 'completed' | 'archived';
  tags?: string[];
}

const ChatHistory: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Cognitive Enhancement Session',
        lastMessage: 'How can I improve my focus?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 15,
        status: 'active',
        tags: ['focus', 'productivity']
      },
      {
        id: '2',
        title: 'Anxiety Management Discussion',
        lastMessage: 'What techniques work best?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageCount: 23,
        status: 'completed',
        tags: ['anxiety', 'wellness']
      },
      {
        id: '3',
        title: 'Sleep Optimization',
        lastMessage: 'My sleep schedule needs help',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        messageCount: 8,
        status: 'archived',
        tags: ['sleep', 'health']
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const handleDeleteSession = (session: ChatSession) => {
    setSelectedSession(session);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSession) {
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
      setDeleteDialogOpen(false);
      setSelectedSession(null);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Chat History
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Review and manage your previous conversations with the AI assistant.
      </Typography>

      {/* Search Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Sessions List */}
      <Paper elevation={1}>
        <List sx={{ width: '100%' }}>
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  borderBottom: index < filteredSessions.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ChatIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {session.title}
                      </Typography>
                      <Chip
                        label={session.status}
                        color={getStatusColor(session.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {session.lastMessage}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(session.timestamp)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {session.messageCount} messages
                        </Typography>
                        {session.tags && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {session.tags.map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    View
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSession(session)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            </motion.div>
          ))}
        </List>

        {filteredSessions.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No conversations found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Start a new conversation to see it here'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the conversation "{selectedSession?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatHistory;
