export const users = {
  admin: {
    name: 'Admin User',
    role: 'Admin',
    password: 'Adm!n@2025$'
  },
  doctor: {
    name: 'Dr. Sarah Johnson',
    role: 'Doctor',
    password: 'DrJ0hnson@2025!'
  },
  psychiatrist: {
    name: 'Dr. Johnson',
    role: 'Psychiatrist',
    password: 'DrJ0hnson@2025!'
  },
  patient: {
    name: 'John Doe',
    role: 'Patient',
    password: 'Pt!ntD03@2025$'
  },
  counselor: {
    name: 'Emma Wilson',
    role: 'Counselor',
    password: 'C0ns!l0r@2025!'
  },
  moderator: {
    name: 'Mike Brown',
    role: 'Moderator',
    password: 'M0d3r@t0r@2025$'
  },
  chatgpt: {
    name: 'ChatGPT',
    role: 'AI Assistant'
  }
};

export const mockAppointments = [
  {
    id: 1,
    patient: 'John Doe',
    doctor: 'Dr. Sarah Johnson',
    date: '2025-05-02',
    time: '10:00 AM',
    status: 'pending',
    notifications: {
      doctor: [],
      patient: []
    }
  },
  {
    id: 2,
    patient: 'Jane Smith',
    doctor: 'Dr. Sarah Johnson',
    date: '2025-05-03',
    time: '2:00 PM',
    status: 'pending',
    notifications: {
      doctor: [],
      patient: []
    }
  },
  {
    id: 3,
    patient: 'Patient Name',
    doctor: 'Dr. Sarah Johnson',
    date: '2025-05-02',
    time: '3:00 PM',
    status: 'pending',
    notifications: {
      doctor: [],
      patient: []
    }
  }
];

export const mockMessages = [
  {
    id: 1,
    patient: 'John Doe',
    message: 'Feeling anxious today, need some guidance.',
    timestamp: '2025-05-01 10:00 AM'
  },
  {
    id: 2,
    patient: 'Jane Smith',
    message: 'Thank you for your support!',
    timestamp: '2025-05-01 11:00 AM'
  }
];

export const mockForumPosts = [
  {
    id: 1,
    title: 'Managing Anxiety',
    content: 'Looking for tips on managing anxiety during work hours.',
    author: 'John Doe',
    timestamp: '2025-05-01 9:00 AM'
  },
  {
    id: 2,
    title: 'Sleep Issues',
    content: 'Having trouble sleeping at night.',
    author: 'Jane Smith',
    timestamp: '2025-05-01 10:00 AM'
  }
];

export const mentalHealthTips = [
  'Practice mindfulness meditation for 10 minutes daily.',
  'Connect with supportive friends and family members.',
  'Take regular breaks during work to stretch and breathe deeply.'
];
