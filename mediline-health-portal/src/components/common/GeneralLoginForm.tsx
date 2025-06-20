import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Hospital, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@/types';

const GeneralLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const getDefaultCredentials = () => {
    const defaults = {
      patient: { email: 'hameem@gmail.com', password: '123456' },
      doctor: { email: 'hameem812@gmail.com', password: '123456' },
      hospital: { email: 'dmc@gmail.com', password: '123456' },
    };
    return defaults[userType];
  };

  const handleLogin = async (credentials: { email: string; password: string }, isDemo: boolean = false) => {
    setIsLoading(true);

    // Client-side validation
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Error",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
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
          throw new Error('Invalid role selected');
      }

      const response = await api.post(endpoint, {
        email: credentials.email,
        password: credentials.password,
      });

      const user = response.data;

      // Extract user directly from response (due to interceptor returning response.data)
      console.log('Extracted User:', user);

      if (!user || !user.type) {
        throw new Error('Invalid response: User data missing or type not provided');
      }

      // Update AuthContext with user data
      setUser(user);

      toast({
        title: isDemo ? 'Demo Login Successful!' : 'Login Successful',
        description: `Welcome to your ${userType.replace('-', ' ')} dashboard`,
      });

      navigate(redirectPath);
    } catch (error) {
      console.error('Login Error Details:', {
        error,
        axiosError: error instanceof AxiosError ? {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        } : null,
      });

      let errorMessage = 'Invalid email or password. Please try again.';
      if (error instanceof AxiosError && error.response?.data) {
        errorMessage = error.response.data.message ||
                       error.response.data.error ||
                       error.response.data.data?.message ||
                       error.response.data.errorMessage ||
                       `Login failed with status ${error.response.status}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: isDemo ? 'Demo Login Failed' : 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
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
          Sign In to MediLine
        </CardTitle>
        <CardDescription className="text-center">
          Choose your account type and enter your credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userType">Account Type</Label>
            <Select
              value={userType}
              onValueChange={(value: UserType) => setUserType(value)}
            >
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default GeneralLoginForm;