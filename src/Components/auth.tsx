import { useState } from 'react';
import axios from 'axios';

interface Profile {
  email: string;
  userId: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  const API_URL = `${API_BASE_URL}/auth`;

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/register`, { email, password });
      alert('Registration successful! You can now log in.');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setToken(res.data.access_token); // assuming JWT response: { access_token: '...' }
      setError('');
      alert('Login successful!');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.response?.data?.message || 'Failed to fetch profile');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Auth Page</h1>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <div className="mb-4 flex justify-between">
          <button
            onClick={handleRegister}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Login
          </button>
        </div>

        {token && (
          <button
            onClick={fetchProfile}
            className="w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            Get Profile
          </button>
        )}

        {profile && (
          <div className="mt-4 rounded border bg-gray-50 p-4">
            <h2 className="mb-2 font-bold">Profile</h2>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>User ID:</strong> {profile.userId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
