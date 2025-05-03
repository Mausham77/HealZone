import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial mock users
let users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', password: 'Admin@2025' },
  { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'Doctor', password: 'Doctor@2025' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Patient', password: 'Patient@2025' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Counselor', password: 'Counselor@2025' },
  { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Moderator', password: 'Moderator@2025' },
  { id: 6, name: 'Dr. Emily Davis', email: 'emily@example.com', role: 'Psychiatrist', password: 'Psychiatrist@2025' }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password, navigate) => {
    const foundUser = users.find(
      u => u.name === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      if (foundUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      return foundUser;
    }
    throw new Error('No user found');
  };

  const logout = (navigate) => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const register = async (formData) => {
    const existing = users.find(u => u.email === formData.email);
    if (existing) {
      throw new Error('User already exists with this email');
    }

    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    users = [...users, newUser]; // Add user to mock DB
    console.log('User registered:', newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
