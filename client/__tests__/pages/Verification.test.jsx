import { render, screen, waitFor, cleanup, act} from '@testing-library/react';
import { describe, it, expect, vitest, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmailVerification from "../../src/pages/Verification";

vitest.mock("axios");

describe("EmailVerification", () => {
  let renderResult;
  let sessionStorageMock;

  beforeEach(() => {
    vitest.clearAllMocks();
    sessionStorageMock = {
      getItem: vitest.fn(),
      setItem: vitest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  });

  afterEach(() => {
    renderResult.unmount();
    vitest.clearAllMocks();
    cleanup()
  });

  async function renderVerification() {
    renderResult = render(
      <MemoryRouter initialEntries={['/verify-email/verificationToken']}>
        <Routes> 
          <Route path="/verify-email/:verificationToken" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    )
  };

  it("renders email verification status correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Email verified successfully!' } });
    await renderVerification();

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(screen.getByText('Your verification status:')).toBeInTheDocument();
    expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
  });

  it('sets verification result in session storage after successful email verification', async () => {
    axios.post.mockResolvedValueOnce();
    await renderVerification();

    expect(sessionStorageMock.getItem).toHaveBeenCalledWith('verificationStatus');

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('verificationStatus', 'Email verified successfully!');
  });

  it('handles failed email verification, and does not set verification result in session storage after failed email verification', async () => {
    axios.post.mockRejectedValueOnce(new Error('Internal server error'));
    await renderVerification();

    expect(sessionStorageMock.getItem).toHaveBeenCalledWith('verificationStatus');

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    expect(screen.getByText('Your verification status:')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Email verification failed.')).toBeInTheDocument());

  });
});
