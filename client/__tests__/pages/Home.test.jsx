import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Home from "../../src/pages/Home";
import { toast } from "react-hot-toast";

const mockNavigate = vitest.fn();

vitest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vitest.mock("react-hot-toast", () => ({
  toast: {
    success: vitest.fn(),
  },
}));

describe("Home", () => {
  beforeEach(() => {
    vitest.mock("axios");
  });

  afterEach(() => {
    vitest.clearAllMocks();
    cleanup();
  });

  it("renders correctly", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Clucker")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("navigates to login on login button click", async () => {
    const { getByText } = render(<Home />);
    fireEvent.click(getByText("Login"));
    expect(toast.success).toHaveBeenCalledWith("Redirecting to Login...");
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("navigates to register on register button click", async () => {
    const { getAllByText } = render(<Home />);
    const registerButtons = getAllByText("Register");
    fireEvent.click(registerButtons[0]);
    expect(toast.success).toHaveBeenCalledWith("Redirecting to Register...");
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/register"));
  });
});
