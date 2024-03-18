import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import { MemoryRouter } from 'react-router-dom';
import ChangePasswordForm from "../../src/pages/PasswordUpdate";
import { toast } from 'react-hot-toast';

vitest.mock("axios");

vitest.mock('react-hot-toast', () => ({
  toast: {
    error: vitest.fn(),
  },
}));

describe("ChangePasswordForm", () => {
  
    let renderResult;
  
    beforeEach(() => {
      renderResult = render(
        <MemoryRouter>
          <ChangePasswordForm />
        </MemoryRouter>
      );
    });
  
    afterEach(() => {
      renderResult.unmount();
      vitest.clearAllMocks();
      cleanup()
    });
  
    it("renders without crashing", () => {
      // Test is implicit in beforeEach
    });
  
    it("should submit form with correct data", async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { error: 'Password changed successfully' } } });

      fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'currentPassword' } });
      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword' } });

      fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));

      await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/change-password', {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      }));
  
      expect(toast.error).toHaveBeenCalledWith('Password changed successfully');
    });

    it('should display error message if request fails', async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid password' } } });
  
      fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'currentPassword' } });
      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword' } });

      fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));
  
      await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/change-password', {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      }));
  
      expect(toast.error).toHaveBeenCalledWith('Invalid password');
    });
  
});