import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface LoginFormProps {
  userType: 'patient' | 'doctor' | 'hospital';
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ userType, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getDefaultCredentials = () => {
    const defaults = {
      'patient': { email: 'john.smith@email.com', password: 'demo123' },
      'doctor': { email: 'dr.johnson@hospital.com', password: 'demo123' },
      'hospital': { email: 'admin@citymedical.com', password: 'demo123' },
    };
    return defaults[userType];
  };

  const handleLogin = async (credentials: { email: string; password: string }, isDemo: boolean = false) => {
    setIsLoading(true);

    // Client-side validation
    if (!credentials.email || !credentials.password) {
      toast({
        title: 'Error',
        description: 'Please fill in both email and password.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      let endpoint = '';
      let redirectPath = '';
      switch (userType) {
        case 'patient':
          endpoint = '/login/patient';
          redirectPath = '/patient/';
          break;
        case 'doctor':
          endpoint = '/login/doctor';
          redirectPath = '/doctor/';
          break;
        case 'hospital':
          endpoint = '/login/hospital';
          redirectPath = '/hospital/';
          break;
        default:
          throw new Error('Invalid user type');
      }

      console.log(`Attempting login to ${endpoint} with email: ${credentials.email}`);

      const response = await api.post(endpoint, {
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Login response:', response.data);

      toast({
        title: isDemo ? 'Demo Login Successful!' : 'Login Successful!',
        description: `Welcome to your ${userType.replace('-', ' ')} dashboard.`,
      });

      // Navigate to the dashboard
      console.log(`Navigating to ${redirectPath}`);
      navigate(redirectPath, { replace: true });

      // Close the modal after navigation
      setTimeout(() => {
        console.log('Calling onClose');
        onClose();
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'Invalid email or password.';
      console.error('Login error:', errorMessage, error);
      toast({
        title: isDemo ? 'Demo Login Failed' : 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  const handleDemoLogin = async () => {
    const defaults = getDefaultCredentials();
    setEmail(defaults.email);
    setPassword(defaults.password);
    await handleLogin(defaults, true);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {userType === 'hospital' ? 'Hospital' : userType.charAt(0).toUpperCase() + userType.slice(1)} Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-medical-600 hover:bg-medical-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Use Demo Account
            </Button>
          </div>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700 text-center">
            <strong>Demo Credentials:</strong>
            <br />
            Email: {getDefaultCredentials().email}
            <br />
            Password: {getDefaultCredentials().password}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;