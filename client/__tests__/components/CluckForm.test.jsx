import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import CluckForm from "../../src/components/CluckForm";
import { UpdateClucksContext } from "../../src/contexts/UpdateClucksContext";
import { LoggedInContext } from "../../src/contexts/LoggedInContext";

vitest.mock("axios");

afterEach(() => {
  cleanup();
  vitest.clearAllMocks();
});

describe("CluckForm", () => {
  const user = {
    _id: "1",
    userName: "TestUser",
  };
  const mockAddCluck = vitest.fn();
  const mockUserId = user._id;

  let renderResult;

  beforeEach(() => {
    renderResult = render(
      <UpdateClucksContext.Provider value={{ addCluck: mockAddCluck }}>
        <LoggedInContext.Provider value={{ userId: mockUserId }}>
          <CluckForm />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
  });

  it("renders without crashing", () => {
    expect(renderResult.getByTestId("cluck-form")).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    fireEvent.change(renderResult.getByRole("textbox"), {
      target: { value: "New cluck" },
    });
    fireEvent.submit(renderResult.getByTestId("cluck-form"));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(
      "/clucks",
      { text: "New cluck" },
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
    );
  });

  it("updates the textarea value when typed into", () => {
    const textarea = renderResult.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test cluck" } });
    expect(textarea.value).toBe("Test cluck");
  });

  it("clears the form after a successful submission", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const textarea = renderResult.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test cluck" } });
    fireEvent.submit(renderResult.getByTestId("cluck-form"));
    await waitFor(() => expect(textarea.value).toBe(""));
  });
});
