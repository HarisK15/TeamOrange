import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import ChangeProfileForm from "../../src/pages/Profile";
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';


vitest.mock('axios', async () => {
  const mockAxiosGet = vitest.fn();
  const mockAxiosPost = vitest.fn();
  
  return {
    default: {
      get: mockAxiosGet,
      post: mockAxiosPost,
    },
  };
});

vitest.mock('react-router-dom', () => ({
    ...vitest.importActual('react-router-dom'),
    useParams: vitest.fn(),
}));

vitest.mock('react-hot-toast', () => ({
  toast: {
    success: vitest.fn(),
    error: vitest.fn(),
  },
}));

describe('ChangeProfileForm', () => {
  const mockAxiosPost = vitest.fn();
  const mockAxiosGet = vitest.fn();
  let renderResult;
  
  beforeEach(() => {
    useParams.mockReturnValue({ profileId: '123' });

    mockAxiosGet.mockResolvedValueOnce({
      data: {
        userId: '123',
      },
    });
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        bio: 'Test bio',
        userName: 'testUser',
        email: 'test@example.com',
      },
    });
  
    axios.post = mockAxiosPost;
    axios.get = mockAxiosGet;
  
    renderResult = render(<ChangeProfileForm />);
  });
  
  afterEach(() => {
    renderResult.unmount();
    vitest.clearAllMocks();
    cleanup()
  });

  it("renders without crashing", () => {
    // Test is implicit in beforeEach
  });
  
  it('renders user data when profileId matches', async () => {
    await waitFor(() => {
      expect(screen.getByText('@testUser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });
  });
  
  it('renders user data when profileId does not match', async () => {
    renderResult.unmount();
    vitest.clearAllMocks();
    cleanup()
    useParams.mockReturnValue({ profileId: '123' });

    mockAxiosGet.mockResolvedValueOnce({
      data: {
        userId: '678',
      },
    });
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        bio: 'Test bio',
        userName: 'testUser',
        email: 'test@example.com',
      },
    });
    axios.get = mockAxiosGet;
  
    renderResult = render(<ChangeProfileForm />);

    await waitFor(() => {
      expect(screen.getByText('@testUser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });
  });
  
  it('updates bio and shows success message on form submission', async () => {
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        message: 'Profile updated successfully',
      },
    });
  
    const bioTextarea = await screen.findByTestId('bio');
    fireEvent.change(bioTextarea, { target: { value: 'New bio' } });
  
    const updateButton = screen.getByRole('button', { name: 'Update Profile' });
    fireEvent.submit(updateButton);
    
    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith('/profile', { bio: 'New bio' });
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    });
  });
  
  it('shows error message if form submission fails', async () => {
    mockAxiosPost.mockRejectedValueOnce({ response: { data: { error: 'Update failed' } } });
  
    const bioTextarea = await screen.findByTestId('bio');
    fireEvent.change(bioTextarea, { target: { value: 'New bio' } });
  
    const updateButton = screen.getByRole('button', { name: 'Update Profile' });
    fireEvent.submit(updateButton);
  
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Update failed'));
    toast.error.mockRestore();
  });
  });