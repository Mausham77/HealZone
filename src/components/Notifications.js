import React, { useMemo } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Button from '@mui/material/Button';

/** @type {React.FC} */
const Notifications = () => {
  const { notifications, unreadCount, markAsRead, clearNotifications, getNotifications } = useNotifications();
  const { user } = useAuth();

  // Filter notifications for the current user
  const userNotifications = useMemo(() => {
    if (!user?.name) return [];
    return getNotifications(user.name);
  }, [user, getNotifications]);

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = useMemo(() => {
    return [...userNotifications].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [userNotifications]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      'appointment_status': <CheckCircleIcon color="success" />,
      'appointment_deleted': <CloseIcon color="error" />,
      'new_appointment': <AddIcon color="primary" />,
      'default': null,
    };
    return iconMap[type] || iconMap['default'];
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearNotifications();
    }
  };

  if (!userNotifications || userNotifications.length === 0) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notifications ({unreadCount} unread)
      </Typography>
      <List role="list">
        {sortedNotifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'background-color 0.3s',
              }}
              role="listitem"
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.timestamp).toLocaleString()}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
              <ListItemSecondaryAction>
                {!notification.read && (
                  <IconButton
                    edge="end"
                    onClick={() => handleMarkAsRead(notification.id)}
                    size="small"
                    aria-label="Mark as read"
                  >
                    <CheckCircleIcon color="success" />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  onClick={handleClearAll}
                  size="small"
                  aria-label="Clear notification"
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {userNotifications.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAll}
          sx={{ mt: 2, ml: 2 }}
          size="small"
          aria-label="Clear all notifications"
        >
          Clear All
        </Button>
      )}
    </Paper>
  );
};

export default Notifications;