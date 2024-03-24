import { render, screen, waitFor, cleanup } from '@testing-library/react';
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
    axios.get.mockResolvedValueOnce({ data: { message: 'Email verified successfully!' } });

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(screen.getByText('Your email verification status:')).toBeInTheDocument();
    expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
  });

  it("handles failed email verification", async () => {
    axios.get.mockResolvedValueOnce(new Error('Email verification failed.'));

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/verify-email/verificationToken'));

    expect(screen.getByText('Your email verification status:')).toBeInTheDocument();
    expect(screen.getByText('Email verification failed.')).toBeInTheDocument();
  });
});
