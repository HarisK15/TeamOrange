import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, it, expect, vitest, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import ChangeProfileForm from '../../src/pages/Profile';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { LoggedInContext } from '../../src/contexts/LoggedInContext';

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
        isLoggedIn: true,
        userId: '123',
      },
    });

    mockAxiosGet.mockResolvedValueOnce({
      data: {
        isFollowing: true,
      },
    });

    mockAxiosGet.mockResolvedValueOnce({
      data: {
        bio: 'Test bio',
        userName: 'testUser',
        email: 'test@example.com',
        followers: [],
        following: [],
      },
    });
    axios.post = mockAxiosPost;
    axios.get = mockAxiosGet;

    renderResult = render(
      <LoggedInContext.Provider
        value={{ userId: '123', setUserId: vitest.fn() }}
      >
        <ChangeProfileForm />
      </LoggedInContext.Provider>
    );
  });

  afterEach(() => {
    renderResult?.unmount();
    vitest?.clearAllMocks();
    cleanup();
  });

  it('renders without crashing', () => {
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
    useParams.mockReturnValue({ profileId: '123' });

    mockAxiosGet.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
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

    renderResult = render(
      <LoggedInContext.Provider
        value={{ userId: '123', setUserId: vitest.fn() }}
      >
        <ChangeProfileForm />
      </LoggedInContext.Provider>
    );
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
      expect(mockAxiosPost).toHaveBeenCalledWith('/profile', {
        bio: 'New bio',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Profile updated successfully'
      );
    });
  });

  it('shows error message if form submission fails', async () => {
    mockAxiosPost.mockRejectedValueOnce({
      response: { data: { error: 'Update failed' } },
    });

    const bioTextarea = await screen.findByTestId('bio');
    fireEvent.change(bioTextarea, { target: { value: 'New bio' } });

    const updateButton = screen.getByRole('button', { name: 'Update Profile' });
    fireEvent.submit(updateButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Update failed')
    );
    toast.error.mockRestore();
  });

  it('shows generic error message if form submission fails and no error from server', async () => {
    mockAxiosPost.mockRejectedValueOnce(new Error());

    const bioTextarea = await screen.findByTestId('bio');
    fireEvent.change(bioTextarea, { target: { value: 'New bio' } });

    const updateButton = screen.getByRole('button', { name: 'Update Profile' });
    fireEvent.submit(updateButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred. Please try again.'
      )
    );
    toast.error.mockRestore();
  });

  describe('Following features', () => {
    const setupTest = async (
      isLoggedIn,
      isFollowing,
      userData,
      postResponse
    ) => {
      // Mock the /check-login endpoint
      mockAxiosGet.mockResolvedValueOnce({
        data: {
          isLoggedIn,
          userId: '123',
        },
      });

      // Mock the /isFollowing/:profileId endpoint
      mockAxiosGet.mockResolvedValueOnce({
        data: {
          isFollowing,
        },
      });

      // Mock the /profile/userData/:profileId endpoint
      mockAxiosGet.mockResolvedValueOnce({
        data: userData,
      });

      axios.get = mockAxiosGet;

      if (postResponse) {
        if (postResponse instanceof Error) {
          mockAxiosPost.mockRejectedValueOnce(postResponse);
        } else {
          mockAxiosPost.mockResolvedValueOnce({
            data: postResponse,
          });
        }
        axios.post = mockAxiosPost;
      }

      renderResult = render(
        <LoggedInContext.Provider
          value={{ userId: '123', setUserId: vitest.fn() }}
        >
          <ChangeProfileForm />
        </LoggedInContext.Provider>
      );
    };

    beforeEach(() => {
      useParams.mockReturnValue({ profileId: '456' });
    });

    afterEach(() => {
      renderResult.unmount();
      vitest.clearAllMocks();
      cleanup();
    });

    it('renders Unfollow button when user is following', async () => {
      await setupTest(true, true, {
        bio: 'Bio',
        userName: 'Username',
        email: 'email@example.com',
        followers: [],
        following: [],
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Unfollow' })
        ).toBeInTheDocument();
      });
    });

    it('shows success message when user unfollows profile', async () => {
      await setupTest(
        true,
        true,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@example.com',
          followers: [],
          following: [],
        },
        {
          message: 'Unfollowed user',
        }
      );

      const unfollowButton = screen.getByRole('button', { name: 'Unfollow' });
      fireEvent.click(unfollowButton);

      await waitFor(() => {
        expect(mockAxiosPost).toHaveBeenCalledWith('/unfollow/456', {
          withCredentials: true,
        });
        expect(toast.success).toHaveBeenCalledWith('Unfollowed user');
      });
    });

    it('shows error message when user fails to unfollow profile', async () => {
      const error = new Error();
      error.response = { data: { error: 'Failed to unfollow user' } };

      await setupTest(
        true,
        true,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@example.com',
          followers: [],
          following: [],
        },
        error
      );

      const unfollowButton = screen.getByRole('button', { name: 'Unfollow' });
      fireEvent.click(unfollowButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to unfollow user');
      });
    });

    it('shows generic error message when user fails to unfollow profile and no error from server', async () => {
      await setupTest(
        true,
        true,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@example.com',
          followers: [],
          following: [],
        },
        new Error()
      );

      const unfollowButton = screen.getByRole('button', { name: 'Unfollow' });
      fireEvent.click(unfollowButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'An error occurred. Please try again.'
        );
      });
    });

    it('renders Follow button when user is not following', async () => {
      await setupTest(true, false, {
        bio: 'Bio',
        userName: 'Username',
        email: 'email@example.com',
        followers: [],
        following: [],
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Follow' })
        ).toBeInTheDocument();
      });
    });

    it('shows success message when user follows profile', async () => {
      await setupTest(
        true,
        false,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@example.com',
          followers: [],
          following: [],
        },
        {
          message: 'Following user',
        }
      );

      const followButton = screen.getByRole('button', { name: 'Follow' });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(mockAxiosPost).toHaveBeenCalledWith('/follow/456', {
          withCredentials: true,
        });
        expect(toast.success).toHaveBeenCalledWith('Following user');
      });
    });

    it('shows error message when user fails to follow profile', async () => {
      const error = new Error();
      error.response = { data: { error: 'Failed to follow user' } };

      await setupTest(
        true,
        false,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@test.com',
          followers: [],
          following: [],
        },
        error
      );

      const followButton = screen.getByRole('button', { name: 'Follow' });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to follow user');
      });
    });

    it('shows generic error message when user fails to follow profile and no error from server', async () => {
      await setupTest(
        true,
        false,
        {
          bio: 'Bio',
          userName: 'Username',
          email: 'email@test.com',
          followers: [],
          following: [],
        },
        new Error()
      );

      const followButton = screen.getByRole('button', { name: 'Follow' });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'An error occurred. Please try again.'
        );
      });
    });
  });
});
