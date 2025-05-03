import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, List, ListItem, ListItemText,
  TextField, Box, Alert, Snackbar, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem,
  Grid, Card, Modal, Chip
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Notifications from './Notifications';

// Mock data
const mockAppointments = [
  {
    id: 1,
    patient: 'John Doe',
    doctor: 'Dr. Sarah Johnson',
    date: '2025-05-02',
    time: '10:00 AM',
    status: 'pending',
    notifications: { doctor: [], patient: [], counselor: [], admin: [], moderator: [], psychiatrist: [] }
  },
  {
    id: 2,
    patient: 'Jane Smith',
    doctor: 'Dr. Sarah Johnson',
    date: '2025-05-03',
    time: '2:00 PM',
    status: 'pending',
    notifications: { doctor: [], patient: [], counselor: [], admin: [], moderator: [], psychiatrist: [] }
  }
];

const mockMessages = [
  {
    id: 1,
    patient: 'John Doe',
    message: 'Feeling anxious today, need some guidance.',
    timestamp: '2025-05-01 10:00 AM',
    type: 'message',
    recipient: 'Emma Wilson',
    read: false
  },
  {
    id: 2,
    patient: 'Jane Smith',
    message: 'Thank you for your support!',
    timestamp: '2025-05-01 11:00 AM',
    type: 'message',
    recipient: 'Emma Wilson',
    read: false
  }
];

const mockForumPosts = [
  {
    id: 1,
    title: 'Managing Anxiety',
    content: 'Looking for tips on managing anxiety during work hours.',
    author: 'John Doe',
    timestamp: '2025-05-01 9:00 AM',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Sleep Issues',
    content: 'Having trouble sleeping at night.',
    author: 'Jane Smith',
    timestamp: '2025-05-01 10:00 AM',
    status: 'pending'
  }
];

const mentalHealthTips = [
  {
    id: 1,
    title: 'Mindfulness Meditation',
    description: 'Practice mindfulness meditation for 10 minutes daily.',
    addedBy: 'Emma Wilson'
  },
  {
    id: 2,
    title: 'Social Connection',
    description: 'Connect with supportive friends and family members.',
    addedBy: 'Emma Wilson'
  },
  {
    id: 3,
    title: 'Work Breaks',
    description: 'Take regular breaks during work to stretch and breathe deeply.',
    addedBy: 'Emma Wilson'
  }
];

// Convert users object to array
const users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'Doctor' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Patient' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Counselor' },
  { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Moderator' },
  { id: 6, name: 'Dr. Emily Davis', email: 'emily@example.com', role: 'Psychiatrist' }
];

const Dashboard = () => {
  const [state, setState] = useState({
    appointments: mockAppointments,
    messages: mockMessages,
    forumPosts: mockForumPosts,
    users: users,
    mentalHealthTips: mentalHealthTips,
    medicalHistory: [],
    newAppointment: { patient: '', doctor: '', date: '', time: '' },
    newUser: { name: '', email: '', role: '', password: '' },
    newSessionNote: '',
    sessionNotes: [],
    newMentalHealthTip: { title: '', description: '' },
    newPrescription: { medication: '', dosage: '', instructions: '' },
    openUserDialog: false,
    openDeleteUserDialog: false,
    userToDelete: null,
    openDeleteAppointmentDialog: false,
    appointmentToDelete: null,
    successMessage: '',
    errorMessage: '',
    openSnackbar: false,
    notificationHistory: [],
    appointmentModal: false,
    mentalHealthTipModal: false,
    prescriptionModal: false,
  });

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const logAction = (action) => {
    updateState({
      notificationHistory: [...state.notificationHistory, {
        id: Date.now(),
        action,
        timestamp: new Date().toISOString(),
        user: user?.name,
      }],
    });
  };

  const auth = useAuth();
  const { user, logout } = auth || {};
  const { markNotificationsRead, addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigate) {
      console.error('Navigate function is not available');
      return;
    }
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      if (!user) {
        throw new Error('User not found');
      }
      await markNotificationsRead(user.name);
      await logout(navigate);
      localStorage.removeItem('user');
      logAction(`User ${user.name} logged out`);
      updateState({
        successMessage: 'Logged out successfully!',
        openSnackbar: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      updateState({
        errorMessage: error.message || 'Failed to logout. Please try again.',
        openSnackbar: true,
      });
    }
  };

  const handleViewProfile = () => {
    addNotification({
      type: 'profile_viewed',
      message: `Profile viewed by ${user.name}`,
      user: user.name,
    });
    logAction(`Profile viewed by ${user.name}`);
    updateState({
      successMessage: 'Profile viewed!',
      openSnackbar: true,
    });
  };

  const handleHelpRequest = () => {
    addNotification({
      type: 'help_request',
      message: `Help request sent by ${user.name}`,
      user: user.name,
    });
    logAction(`Help request sent by ${user.name}`);
    updateState({
      successMessage: 'Help request sent!',
      openSnackbar: true,
    });
  };

  const handleViewMedicalRecords = () => {
    logAction(`Medical records accessed by ${user.name}`);
    updateState({
      successMessage: 'Medical records accessed!',
      openSnackbar: true,
    });
  };

  const handleViewMedicalHistory = () => {
    logAction(`Medical history accessed by ${user.name}`);
    updateState({
      successMessage: 'Medical history accessed!',
      openSnackbar: true,
    });
  };

  const handlePrescribeMedication = (e) => {
    e.preventDefault();
    const { medication, dosage, instructions } = state.newPrescription;
    if (!medication || !dosage || !instructions) {
      updateState({
        errorMessage: 'Please fill all prescription fields',
        openSnackbar: true,
      });
      return;
    }
    const newPrescription = {
      id: Date.now(),
      medication,
      dosage,
      instructions,
      prescribedBy: user.name,
      date: new Date().toISOString(),
    };
    const messages = [
      {
        id: state.messages.length + 1,
        patient: 'System',
        message: `New prescription added by ${user.name}: ${medication}`,
        timestamp: new Date().toISOString(),
        type: 'prescription',
        recipient: 'Admin User',
        read: false,
      },
      {
        id: state.messages.length + 2,
        patient: 'System',
        message: `New prescription added by ${user.name}: ${medication}`,
        timestamp: new Date().toISOString(),
        type: 'prescription',
        recipient: 'Emma Wilson',
        read: false,
      },
    ];
    logAction(`Prescription added by ${user.name}: ${medication}`);
    updateState({
      medicalHistory: [...state.medicalHistory, newPrescription],
      messages: [...state.messages, ...messages],
      newPrescription: { medication: '', dosage: '', instructions: '' },
      prescriptionModal: false,
      successMessage: 'Medication prescribed successfully!',
      openSnackbar: true,
    });
    messages.forEach(msg => {
      addNotification({
        type: 'prescription_added',
        message: `New prescription added by ${user.name}: ${medication}`,
        user: msg.recipient,
      });
    });
  };

  const handleNewPrescriptionChange = (e) => {
    updateState({
      newPrescription: { ...state.newPrescription, [e.target.name]: e.target.value },
    });
  };

  const handleUpdateSessionNotes = (e) => {
    e.preventDefault();
    const note = state.newSessionNote.trim();
    if (!note) {
      updateState({
        errorMessage: 'Please enter session notes',
        openSnackbar: true,
      });
      return;
    }
    const patient = state.appointments.find(app => app.doctor === user.name && app.status === 'approved')?.patient || 'System';
    const messages = [
      {
        id: state.messages.length + 1,
        patient,
        message: `Session notes updated by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'session_note',
        recipient: patient,
        read: false,
      },
      {
        id: state.messages.length + 2,
        patient,
        message: `Session notes updated by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'session_note',
        recipient: 'Admin User',
        read: false,
      },
      {
        id: state.messages.length + 3,
        patient,
        message: `Session notes updated by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'session_note',
        recipient: 'Emma Wilson',
        read: false,
      },
    ];
    logAction(`Session notes updated by ${user.name} for ${patient}`);
    updateState({
      sessionNotes: [...state.sessionNotes, {
        id: Date.now(),
        patient,
        notes: note,
        timestamp: new Date().toISOString(),
        addedBy: user.name,
      }],
      messages: [...state.messages, ...messages],
      newSessionNote: '',
      successMessage: 'Session notes updated successfully!',
      openSnackbar: true,
    });
    messages.forEach(msg => {
      addNotification({
        type: 'session_notes_updated',
        message: `Session notes updated by ${user.name}`,
        user: msg.recipient,
      });
    });
  };

  const handleNewSessionNote = (e) => {
    updateState({ newSessionNote: e.target.value });
  };

  const handleAddMentalHealthTip = (e) => {
    e.preventDefault();
    const { title, description } = state.newMentalHealthTip;
    if (!title || !description) {
      updateState({
        errorMessage: 'Please fill all fields for mental health tip',
        openSnackbar: true,
      });
      return;
    }
    const newTip = {
      id: Date.now(),
      title,
      description,
      addedBy: user.name,
    };
    const patientMessages = state.users
      .filter(u => u.role === 'Patient')
      .map(patient => ({
        id: state.messages.length + patient.id,
        patient: patient.name,
        message: `New mental health resource added: ${title}`,
        timestamp: new Date().toISOString(),
        type: 'resource',
        recipient: patient.name,
        read: false,
      }));
    const adminMessage = {
      id: state.messages.length + state.users.length + 1,
      patient: 'System',
      message: `New mental health resource added by ${user.name}: ${title}`,
      timestamp: new Date().toISOString(),
      type: 'resource',
      recipient: 'Admin User',
      read: false,
    };
    logAction(`Mental health tip added by ${user.name}: ${title}`);
    updateState({
      mentalHealthTips: [...state.mentalHealthTips, newTip],
      messages: [...state.messages, ...patientMessages, adminMessage],
      newMentalHealthTip: { title: '', description: '' },
      mentalHealthTipModal: false,
      successMessage: 'Mental health tip added successfully!',
      openSnackbar: true,
    });
    patientMessages.forEach(msg => {
      addNotification({
        type: 'mental_health_tip_added',
        message: `New mental health resource: ${title}`,
        user: msg.recipient,
      });
    });
    addNotification({
      type: 'mental_health_tip_added',
      message: `New mental health resource added by ${user.name}: ${title}`,
      user: 'Admin User',
    });
  };

  const handleNewMentalHealthTipChange = (e) => {
    updateState({
      newMentalHealthTip: { ...state.newMentalHealthTip, [e.target.name]: e.target.value },
    });
  };

  const handleAppointmentStatus = (appointmentId, status) => {
    const appointment = state.appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    const updatedAppointments = state.appointments.map(app =>
      app.id === appointmentId ? { ...app, status } : app
    );
    const statusMessage = status === 'rejected'
      ? `Your appointment with ${appointment.doctor} on ${appointment.date} at ${appointment.time} has been rejected.`
      : `Your appointment with ${appointment.doctor} on ${appointment.date} at ${appointment.time} has been ${status}.`;
    const messages = [
      {
        id: state.messages.length + 1,
        patient: appointment.patient,
        message: statusMessage,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: appointment.patient,
        read: false,
      },
      {
        id: state.messages.length + 2,
        patient: appointment.patient,
        message: `Appointment with ${appointment.patient} on ${appointment.date} at ${appointment.time} ${status} by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Admin User',
        read: false,
      },
      {
        id: state.messages.length + 3,
        patient: appointment.patient,
        message: `Appointment with ${appointment.patient} on ${appointment.date} at ${appointment.time} ${status} by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Emma Wilson',
        read: false,
      },
      {
        id: state.messages.length + 4 - 1,
        patient: appointment.patient,
        message: `Appointment with ${appointment.patient} on ${appointment.date} at ${appointment.time} ${status} by ${user.name}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Mike Brown',
        read: false,
      },
    ];
    logAction(`Appointment ${status} by ${user.name} for ${appointment.patient}`);
    updateState({
      appointments: updatedAppointments,
      messages: [...state.messages, ...messages],
      successMessage: `Appointment ${status} successfully!`,
      openSnackbar: true,
    });
    messages.forEach(msg => {
      addNotification({
        type: 'appointment_status',
        message: msg.message,
        user: msg.recipient,
      });
    });
  };

  const handleApproveAppointment = (appointmentId) => {
    handleAppointmentStatus(appointmentId, 'approved');
  };

  const handleHoldAppointment = (appointmentId) => {
    handleAppointmentStatus(appointmentId, 'hold');
  };

  const handleRejectAppointment = (appointmentId) => {
    const appointmentToDelete = state.appointments.find(app => app.id === appointmentId);
    updateState({ appointmentToDelete, openDeleteAppointmentDialog: true });
  };

  const confirmDeleteAppointment = () => {
    const appointment = state.appointmentToDelete;
    if (appointment) {
      handleAppointmentStatus(appointment.id, 'rejected');
    }
    updateState({
      openDeleteAppointmentDialog: false,
      appointmentToDelete: null,
    });
  };

  const handleNewAppointment = (e) => {
    e.preventDefault();
    const { patient, doctor, date, time } = state.newAppointment;
    console.log('Form submission values:', { patient, doctor, date, time }); // Debug log
    if (!patient || !doctor || !date || !time) {
      updateState({
        errorMessage: 'Please fill all appointment fields',
        openSnackbar: true,
      });
      return;
    }
    const newAppointment = {
      id: Date.now(),
      patient,
      doctor,
      date,
      time,
      status: 'pending',
      notifications: { doctor: [], patient: [], counselor: [], admin: [], moderator: [], psychiatrist: [] },
    };
    const messages = [
      {
        id: state.messages.length + 1,
        patient,
        message: `New appointment request from ${patient} for ${date} at ${time}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: doctor,
        read: false,
      },
      {
        id: state.messages.length + 2,
        patient,
        message: `New appointment request from ${patient} for ${date} at ${time}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Emma Wilson',
        read: false,
      },
      {
        id: state.messages.length + 3,
        patient,
        message: `New appointment booked by ${patient} for ${date} at ${time}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Admin User',
        read: false,
      },
      {
        id: state.messages.length + 4,
        patient,
        message: `New appointment booked by ${patient} for ${date} at ${time}`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: 'Mike Brown',
        read: false,
      },
      {
        id: state.messages.length + 5,
        patient,
        message: `Your appointment with ${doctor} on ${date} at ${time} is pending approval`,
        timestamp: new Date().toISOString(),
        type: 'appointment',
        recipient: patient,
        read: false,
      },
    ];
    logAction(`Appointment booked by ${patient} for ${date} at ${time}`);
    updateState({
      appointments: [...state.appointments, newAppointment],
      messages: [...state.messages, ...messages],
      newAppointment: { patient: user?.role === 'Patient' ? user.name : '', doctor: '', date: '', time: '' },
      appointmentModal: false,
      successMessage: 'Appointment booked successfully!',
      openSnackbar: true,
    });
    messages.forEach(msg => {
      addNotification({
        type: 'new_appointment',
        message: msg.message,
        user: msg.recipient,
      });
    });
  };

  const handleNewAppointmentChange = (e) => {
    const { name, value } = e.target;
    updateState({
      newAppointment: { ...state.newAppointment, [name]: value },
    });
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
      updateState({ errorMessage: 'Please fill all fields', openSnackbar: true });
      return;
    }
    const newUser = { id: Date.now(), name, email, role };
    const adminMessage = {
      id: state.messages.length + 1,
      patient: 'System',
      message: `New user ${name} (${role}) added by ${user.name}`,
      timestamp: new Date().toISOString(),
      type: 'user_management',
      recipient: 'Admin User',
      read: false,
    };
    logAction(`New user ${name} added by ${user.name}`);
    updateState({
      users: [...state.users, newUser],
      messages: [...state.messages, adminMessage],
      newUser: { name: '', email: '', role: '', password: '' },
      openUserDialog: false,
      successMessage: 'User added successfully!',
      openSnackbar: true,
    });
    addNotification({
      type: 'user_added',
      message: `New user ${name} added by ${user.name}`,
      user: 'Admin User',
    });
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = state.users.find(u => u.id === userId);
    updateState({ userToDelete, openDeleteUserDialog: true });
  };

  const confirmDeleteUser = () => {
    const updatedUsers = state.users.filter(u => u.id !== state.userToDelete.id);
    const adminMessage = {
      id: state.messages.length + 1,
      patient: 'System',
      message: `User ${state.userToDelete.name} deleted by ${user.name}`,
      timestamp: new Date().toISOString(),
      type: 'user_management',
      recipient: 'Admin User',
      read: false,
    };
    logAction(`User ${state.userToDelete.name} deleted by ${user.name}`);
    updateState({
      users: updatedUsers,
      messages: [...state.messages, adminMessage],
      openDeleteUserDialog: false,
      userToDelete: null,
      successMessage: 'User deleted successfully!',
      openSnackbar: true,
    });
    addNotification({
      type: 'user_deleted',
      message: `User ${state.userToDelete.name} deleted by ${user.name}`,
      user: 'Admin User',
    });
  };

  const handleApprovePost = (postId) => {
    const updatedPosts = state.forumPosts.map(post =>
      post.id === postId ? { ...post, status: 'approved' } : post
    );
    const post = state.forumPosts.find(p => p.id === postId);
    const adminMessage = {
      id: state.messages.length + 1,
      patient: 'System',
      message: `Post "${post.title}" approved by ${user.name}`,
      timestamp: new Date().toISOString(),
      type: 'post_management',
      recipient: 'Admin User',
      read: false,
    };
    logAction(`Post "${post.title}" approved by ${user.name}`);
    updateState({
      forumPosts: updatedPosts,
      messages: [...state.messages, adminMessage],
      successMessage: 'Post approved successfully!',
      openSnackbar: true,
    });
    addNotification({
      type: 'post_approved',
      message: `Post "${post.title}" approved by ${user.name}`,
      user: 'Admin User',
    });
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = state.forumPosts.filter(post => post.id !== postId);
    const post = state.forumPosts.find(p => p.id === postId);
    const adminMessage = {
      id: state.messages.length + 1,
      patient: 'System',
      message: `Post "${post.title}" deleted by ${user.name}`,
      timestamp: new Date().toISOString(),
      type: 'post_management',
      recipient: 'Admin User',
      read: false,
    };
    logAction(`Post "${post.title}" deleted by ${user.name}`);
    updateState({
      forumPosts: updatedPosts,
      messages: [...state.messages, adminMessage],
      successMessage: 'Post deleted successfully!',
      openSnackbar: true,
    });
    addNotification({
      type: 'post_deleted',
      message: `Post "${post.title}" deleted by ${user.name}`,
      user: 'Admin User',
    });
  };

  const handleCloseDialog = () => {
    updateState({
      openUserDialog: false,
      openDeleteUserDialog: false,
      openDeleteAppointmentDialog: false,
      newUser: { name: '', email: '', role: '', password: '' },
      userToDelete: null,
      appointmentToDelete: null,
    });
  };

  const handleCloseSnackbar = () => {
    updateState({ openSnackbar: false, successMessage: '', errorMessage: '' });
  };

  const renderAppointmentList = (role) => {
    const filteredAppointments = role === 'Admin' || role === 'Counselor' || role === 'Moderator'
      ? state.appointments
      : role === 'Patient'
      ? state.appointments.filter(app => app.patient === user?.name)
      : state.appointments.filter(app => app.doctor === user?.name);

    return (
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
              {['Doctor', 'Psychiatrist', 'Counselor'].includes(role) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.id}</TableCell>
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    color={
                      appointment.status === 'approved' ? 'success' :
                      appointment.status === 'hold' ? 'warning' :
                      appointment.status === 'rejected' ? 'error' : 'default'
                    }
                  />
                </TableCell>
                {['Doctor', 'Psychiatrist', 'Counselor'].includes(role) && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleApproveAppointment(appointment.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => handleHoldAppointment(appointment.id)}
                          >
                            Hold
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRejectAppointment(appointment.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {appointment.status === 'hold' && (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleApproveAppointment(appointment.id)}
                        >
                          Approve from Hold
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderNotifications = () => (
    <Card sx={{ mb: 4, p: 2 }}>
      <Notifications />
    </Card>
  );

  const renderContent = () => {
    switch (user?.role) {
      case 'Doctor':
      case 'Psychiatrist':
        return (
          <Box>
            {renderNotifications()}
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              {renderAppointmentList(user.role)}
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Patient Records
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleViewMedicalHistory}
                  >
                    View Medical History
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => updateState({ prescriptionModal: true })}
                  >
                    Prescribe Medication
                  </Button>
                </Grid>
              </Grid>
              {state.medicalHistory.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Instructions</TableCell>
                        <TableCell>Prescribed By</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.medicalHistory.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.medication}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.instructions}</TableCell>
                          <TableCell>{prescription.prescribedBy}</TableCell>
                          <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Box>
        );

      case 'Admin':
        return (
          <Box>
            {renderNotifications()}
            <Card sx={{ mb: 4, p: 2 }}>
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
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
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
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={
                              appointment.status === 'approved' ? 'success' :
                              appointment.status === 'hold' ? 'warning' :
                              appointment.status === 'rejected' ? 'error' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Forum Posts
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.forumPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.status}</TableCell>
                        <TableCell>
                          {post.status === 'pending' && (
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleApprovePost(post.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Admin Activity Log
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.notificationHistory.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell>{new Date(note.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{note.user}</TableCell>
                        <TableCell>{note.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        );

      case 'Patient':
        return (
          <Box>
            {renderNotifications()}
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Common Functions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button variant="outlined" fullWidth onClick={handleViewProfile}>
                    View Profile
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" fullWidth onClick={handleHelpRequest}>
                    Request Help
                  </Button>
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Patient Functions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      updateState({ appointmentModal: true, newAppointment: { ...state.newAppointment, patient: user?.name || '' } });
                    }}
                  >
                    Book Appointment
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleViewMedicalRecords}
                  >
                    View Medical Records
                  </Button>
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              {renderAppointmentList('Patient')}
            </Card>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mental Health Resources
              </Typography>
              <List>
                {state.mentalHealthTips.map((tip) => (
                  <ListItem key={tip.id}>
                    <ListItemText
                      primary={tip.title}
                      secondary={`${tip.description} (Added by ${tip.addedBy})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <List>
                {state.messages
                  .filter((msg) => msg.recipient === user?.name || msg.patient === user?.name)
                  .map((msg) => (
                    <ListItem key={msg.id}>
                      <ListItemText
                        primary={msg.message}
                        secondary={`From: ${msg.patient} | To: ${msg.recipient} | ${new Date(msg.timestamp).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Card>
          </Box>
        );

      case 'Counselor':
        return (
          <Box>
            {renderNotifications()}
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Common Functions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button variant="outlined" fullWidth onClick={handleViewProfile}>
                    View Profile
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" fullWidth onClick={handleHelpRequest}>
                    Request Help
                  </Button>
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              {renderAppointmentList('Counselor')}
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Session Notes
              </Typography>
              <TextField
                fullWidth
                label="Add Session Notes"
                multiline
                rows={4}
                value={state.newSessionNote}
                onChange={handleNewSessionNote}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleUpdateSessionNotes}
                sx={{ mt: 2 }}
              >
                Save Notes
              </Button>
              {state.sessionNotes.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Saved Notes:</Typography>
                  <List>
                    {state.sessionNotes.map(note => (
                      <ListItem key={note.id}>
                        <ListItemText
                          primary={note.notes}
                          secondary={`For ${note.patient} by ${note.addedBy} on ${new Date(note.timestamp).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Card>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Mental Health Resources
              </Typography>
              <Button
                variant="contained"
                onClick={() => updateState({ mentalHealthTipModal: true })}
                sx={{ mb: 2 }}
              >
                Add New Resource
              </Button>
              <List>
                {state.mentalHealthTips.map((tip) => (
                  <ListItem key={tip.id}>
                    <ListItemText
                      primary={tip.title}
                      secondary={`${tip.description} (Added by ${tip.addedBy})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        );

      case 'Moderator':
        return (
          <Box>
            {renderNotifications()}
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              {renderAppointmentList('Moderator')}
            </Card>
            <Card sx={{ mb: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Forum Posts
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.forumPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.status}</TableCell>
                        <TableCell>
                          {post.status === 'pending' && (
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleApprovePost(post.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Welcome, {user?.name || 'Guest'}
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        {renderContent()}
        <Modal
          open={state.appointmentModal}
          onClose={() => updateState({ appointmentModal: false })}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 400
          }}>
            <Typography variant="h6" gutterBottom>
              Book Appointment
            </Typography>
            <TextField
              fullWidth
              label="Patient Name"
              name="patient"
              value={state.newAppointment.patient}
              onChange={handleNewAppointmentChange}
              margin="normal"
              disabled={user?.role === 'Patient'}
            />
            <TextField
              select
              fullWidth
              label="Doctor/Psychiatrist"
              name="doctor"
              value={state.newAppointment.doctor}
              onChange={handleNewAppointmentChange}
              margin="normal"
            >
              {state.users
                .filter(u => ['Doctor', 'Psychiatrist'].includes(u.role))
                .map(u => (
                  <MenuItem key={u.id} value={u.name}>{u.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={state.newAppointment.date}
              onChange={handleNewAppointmentChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              name="time"
              value={state.newAppointment.time}
              onChange={handleNewAppointmentChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => updateState({ appointmentModal: false })}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleNewAppointment}
              >
                Book
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={state.mentalHealthTipModal}
          onClose={() => updateState({ mentalHealthTipModal: false })}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 400
          }}>
            <Typography variant="h6" gutterBottom>
              Add Mental Health Resource
            </Typography>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={state.newMentalHealthTip.title}
              onChange={handleNewMentalHealthTipChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={state.newMentalHealthTip.description}
              onChange={handleNewMentalHealthTipChange}
              margin="normal"
              multiline
              rows={4}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => updateState({ mentalHealthTipModal: false })}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddMentalHealthTip}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={state.prescriptionModal}
          onClose={() => updateState({ prescriptionModal: false })}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 400
          }}>
            <Typography variant="h6" gutterBottom>
              Prescribe Medication
            </Typography>
            <TextField
              fullWidth
              label="Medication"
              name="medication"
              value={state.newPrescription.medication}
              onChange={handleNewPrescriptionChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Dosage"
              name="dosage"
              value={state.newPrescription.dosage}
              onChange={handleNewPrescriptionChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Instructions"
              name="instructions"
              value={state.newPrescription.instructions}
              onChange={handleNewPrescriptionChange}
              margin="normal"
              multiline
              rows={4}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => updateState({ prescriptionModal: false })}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handlePrescribeMedication}
              >
                Prescribe
              </Button>
            </Box>
          </Box>
        </Modal>
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
              Are you sure you want to delete user {state.userToDelete?.name}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={confirmDeleteUser} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={state.openDeleteAppointmentDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Reject Appointment</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to reject the appointment with {state.appointmentToDelete?.patient} on {state.appointmentToDelete?.date} at {state.appointmentToDelete?.time}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={confirmDeleteAppointment} color="error">Reject</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={state.openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={state.errorMessage ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {state.errorMessage || state.successMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Dashboard;