import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem, Box, Divider
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data
const users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'Doctor' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Patient' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Counselor' },
  { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Moderator' },
  { id: 6, name: 'Dr. Emily Davis', email: 'emily@example.com', role: 'Psychiatrist' }
];

const initialAppointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Sarah Johnson', date: '2025-05-03', time: '10:00 AM', status: 'Scheduled' }
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({
    users,
    appointments: initialAppointments,
    activities: [],
    newUser: { name: '', email: '', role: '', password: '' },
    openUserDialog: false,
    openDeleteUserDialog: false,
    userToDelete: null,
  });

  // Log state for debugging
  console.log('Current state:', state);

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const logActivity = (action, details) => {
    const newActivity = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    updateState({
      activities: [newActivity, ...state.activities].slice(0, 50), // Keep last 50 activities
    });
  };

  const handleLogout = () => {
    logout(navigate); // Pass navigate to logout
    logActivity('Logout', `Admin ${user.name} logged out`);
  };

  const handleNewUserChange = (e) => {
    updateState({
      newUser: { ...state.newUser, [e.target.name]: e.target.value },
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const { name, email, role, password } = state.newUser;
    if (!name || !email || !role || !password) {
      return;
    }
    const newUser = { id: Date.now(), name, email, role };
    updateState({
      users: [...state.users, newUser],
      newUser: { name: '', email: '', role: '', password: '' },
      openUserDialog: false,
    });
    logActivity('Add User', `Added user: ${name} (${role})`);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = state.users.find(u => u.id === userId);
    updateState({ userToDelete, openDeleteUserDialog: true });
  };

  const confirmDeleteUser = () => {
    const updatedUsers = state.users.filter(u => u.id !== state.userToDelete.id);
    updateState({
      users: updatedUsers,
      openDeleteUserDialog: false,
      userToDelete: null,
    });
    logActivity('Delete User', `Deleted user: ${state.userToDelete.name}`);
  };

  const handleCloseDialog = () => {
    updateState({
      openUserDialog: false,
      openDeleteUserDialog: false,
      newUser: { name: '', email: '', role: '', password: '' },
      userToDelete: null,
    });
  };

  // Simulate receiving new appointments (in a real app, this would come from an API)
  useEffect(() => {
    const handleNewAppointment = (newAppointment) => {
      updateState({
        appointments: [...state.appointments, { id: Date.now(), ...newAppointment }],
      });
      logActivity('New Appointment', `Patient: ${newAppointment.patient}, Doctor: ${newAppointment.doctor}`);
    };

    // Example: Simulate new appointment (replace with actual API integration)
    const timer = setTimeout(() => {
      handleNewAppointment({
        patient: 'Jane Smith',
        doctor: 'Dr. Emily Davis',
        date: '2025-05-04',
        time: '2:00 PM',
        status: 'Scheduled',
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.appointments]);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard - Welcome, {user.name || 'Guest'}
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* User Management Section */}
        <Typography variant="h6" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => updateState({ openUserDialog: true })}
          sx={{ mb: 2 }}
        >
          Add New User
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* Appointments Section */}
        <Typography variant="h6" gutterBottom>
          Patient Appointments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.appointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.patient}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* Activity Log Section */}
        <Typography variant="h6" gutterBottom>
          Admin Activity Log
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.activities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialogs */}
        <Dialog open={state.openUserDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={state.newUser.name}
              onChange={handleNewUserChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={state.newUser.email}
              onChange={handleNewUserChange}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={state.newUser.role}
              onChange={handleNewUserChange}
              margin="normal"
            >
              {['Admin', 'Doctor', 'Patient', 'Psychiatrist', 'Counselor', 'Moderator'].map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={state.newUser.password}
              onChange={handleNewUserChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddUser} color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={state.openDeleteUserDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user {state.userToDelete?.name || ''}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={confirmDeleteUser} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;