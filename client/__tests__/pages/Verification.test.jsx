import { render, screen, waitFor, cleanup, act} from '@testing-library/react';
import { describe, it, expect, vitest, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmailVerification from "../../src/pages/Verification";

vitest.mock("axios");

describe("EmailVerification", () => {
  let renderResult;

  beforeEach(() => {
    renderResult = render(
      <MemoryRouter initialEntries={['/verify-email/verificationToken']}>
        <Routes> 
          <Route path="/verify-email/:verificationToken" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );
  });

  afterEach(() => {
    if (renderResult) {
      renderResult.unmount();
    }
    vitest.clearAllMocks();
    cleanup()
  });

  it("renders email verification status correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Email verified successfully!' } });

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(screen.getByText('Your email verification status:')).toBeInTheDocument();
    expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
  });

  it("handles failed email verification", async () => {
    const mockAxiosPost = vitest.fn();
    mockAxiosPost.mockRejectedValueOnce({
      response: { data: { error: 'Internal server error' } },
    });
    //axios.post.mockResolvedValueOnce(new Error('Internal server error'));
    renderResult.unmount();
    renderResult = render(
      <MemoryRouter initialEntries={['/verify-email/verification']}>
        <Routes> 
          <Route path="/verify-email/:verificationToken" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/verify-email/verification'));

    expect(screen.getByText('Your email verification status:')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Email verification failed.')).toBeInTheDocument();
    });
  });
});
