import { describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { render, fireEvent, waitFor,cleanup } from '@testing-library/react/';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import Register from '../../src/pages/Register'; 

vi.mock('axios');
vi.mock('react-hot-toast');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom'); 
  return {
    ...actual, 
    useNavigate: () => mockNavigate, 
  };
});


describe('Register Component', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully registers a user, shows success toast, and navigates to login page', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });

    // Simulate form submission
    fireEvent.click(getByRole('button', { name: 'Register' }));

    // Wait for async actions to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('register', {
        userName: 'testUser',
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Login Successful. Welcome!');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles registration error and shows error toast', async () => {
    axios.post.mockResolvedValue({ data: { error: 'Registration failed' } });

    const { getByRole } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });

    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });
});

