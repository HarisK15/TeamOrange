import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {cleanup, waitFor, fireEvent, render } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoggedInContext } from '../../src/contexts/LoggedInContext';
import Login from '../../src/pages/Login';
import { after } from 'lodash';


vi.mock('axios');
vi.mock('react-hot-toast', () =>({
    ...vi.importActual('react-hot-toast'),
    toast: {
        ...vi.importActual('react-hot-toast').toast,
        error: vi.fn(),
    }
}));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom'); 
  return {
    ...actual, 
    useNavigate: () => mockNavigate, 
  };
});

describe('Login Component', () => {

    beforeEach(() => {
    vi.resetAllMocks();
  })
    afterEach(() => {
        cleanup();
    });


  it('successfully logs in a user and navigates to the Clucks page', async () => {
    const setIsLoggedIn = vi.fn();
    axios.post.mockResolvedValue({ data: {} }); 

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <LoggedInContext.Provider value={{ setIsLoggedIn }}>
          <Login />
        </LoggedInContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith('/Clucks');
  });

  it('displays an error toast on login failure', async () => {
    axios.post.mockResolvedValue({ data: { error: 'Invalid credentials' } }); 
  
    const setIsLoggedIn = vi.fn();
    const { getByPlaceholderText, getByRole } = render(
        <MemoryRouter>
        <LoggedInContext.Provider value={{ setIsLoggedIn }}>
          <Login />
        </LoggedInContext.Provider>
      </MemoryRouter>
    );
  
    // Interact with the form
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.submit(getByRole('button', { name: /log in/i }));
  
    // Assertions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/login', {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
    });
  
    // Ensure toast.error was called
    expect(toast.error).toHaveBeenCalledTimes(1);
  
    // Ensure navigate was not called since login failed
    expect(mockNavigate).not.toHaveBeenCalled();
  
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });
  
});
