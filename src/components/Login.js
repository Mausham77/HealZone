import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box,
  Alert,
  Link
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'Heal Zone - Login';
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.name.trim(), formData.password, navigate);
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            Heal Zone
          </Typography>
          <Typography 
            variant="subtitle1" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ color: 'text.secondary', mb: 4 }}
          >
            Welcome back! Please login to continue
          </Typography>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 1 }}
            >
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={error && !formData.name}
              helperText={error && !formData.name ? 'Please enter your username' : ''}
              sx={{ mb: 2 }}
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={error && !formData.password}
              helperText={error && !formData.password ? 'Please enter your password' : ''}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ 
                mt: 2, 
                py: 1.5,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                }
              }}
              disabled={loading || !formData.name || !formData.password}
            >
              {loading ? (
                <>
                  <Box component="span" sx={{ mr: 1 }}>
                    Logging in...
                  </Box>
                  <Box component="span" sx={{ width: 15, height: 15, display: 'inline-block' }}>
                    {/* Add loading spinner here if needed */}
                  </Box>
                </>
              ) : (
                'Login'
              )}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/register" variant="body2">
                Don’t have an account? Register
              </Link>
            </Box>
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Link href="../components/Home.js" variant="body2">
                Back to Home
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;