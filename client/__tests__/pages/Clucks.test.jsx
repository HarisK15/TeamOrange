import { render, act, cleanup } from "@testing-library/react";
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import { UpdateClucksContext } from "../../src/contexts/UpdateClucksContext";
import { LoggedInContext } from "../../src/contexts/LoggedInContext";
import Clucks from "../../src/pages/Clucks";

vitest.mock("axios");

describe("Clucks", () => {
  const mockSetUserId = vitest.fn();
  const clucks = [
    {
      _id: "1",
      text: "Test cluck 1",
      user: { _id: "1", userName: "TestUser1" },
    },
    {
      _id: "2",
      text: "Test cluck 2",
      user: { _id: "2", userName: "TestUser2" },
    },
  ];

  let renderResult;

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { isLoggedIn: true, userId: "1" } });
    renderResult = render(
      <UpdateClucksContext.Provider value={{ clucks }}>
        <LoggedInContext.Provider value={{ setUserId: mockSetUserId }}>
          <Clucks />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
  });

  afterEach(() => {
    vitest.clearAllMocks();
    cleanup();
  });

  it("renders without crashing", () => {
    // Test is implicit in beforeEach
  });

  it("renders the CluckForm component", () => {
    expect(renderResult.getByTestId("cluck-form")).toBeInTheDocument();
  });

  it("renders the SearchBar component", () => {
    expect(renderResult.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("fetches the user on mount", async () => {
    await act(async () => {
      // Render is implicit in beforeEach
    });

    expect(axios.get).toHaveBeenCalledWith("/check-login");
    expect(mockSetUserId).toHaveBeenCalledWith("1");
  });

  it("renders the correct number of CluckBox components", () => {
    const cluckBoxes = renderResult.getAllByTestId("cluck-box");
    expect(cluckBoxes.length).toBe(clucks.length);
  });
});
