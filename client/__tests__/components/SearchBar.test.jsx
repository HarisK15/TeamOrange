import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import axios from "axios";
import SearchBar from "../../src/components/SearchBar";
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter as Router } from "react-router-dom";
import { LoggedInContext } from "../../src/contexts/LoggedInContext";
import { UpdateClucksContext } from "../../src/contexts/UpdateClucksContext";

vitest.mock("axios");

describe("SearchBar", () => {
  beforeEach(() => {
    window.HTMLFormElement.prototype.requestSubmit = function () {
      const event = new Event("submit");
      this.dispatchEvent(event);
    };

    axios.get.mockResolvedValue({ data: { users: [], clucks: [] } });
  });

  afterEach(() => {
    vitest.clearAllMocks();
    cleanup();
  });

  it("renders without crashing", () => {
    render(
      <Router>
        <SearchBar />
      </Router>
    );
    
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("renders SearchBar and performs search", async () => {
    const data = {
      data: {
        users: [
          { _id: "1", userName: "testUser", followers: [], following: [] },
        ],
        clucks: [
          {
            _id: "1",
            text: "testCluck",
            user: { followers: [], following: [] },
          },
        ],
      },
    };

    axios.get.mockResolvedValue(data);

    render(
      <Router>
        <UpdateClucksContext.Provider value={{ updateCluck: vitest.fn() }}>
          <LoggedInContext.Provider value={{ userId: "1" }}>
            <SearchBar />
          </LoggedInContext.Provider>
        </UpdateClucksContext.Provider>
      </Router>
    );

    fireEvent.change(screen.getByTestId("search-field"), {
      target: { value: "test" },
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    expect(axios.get).toHaveBeenCalledWith("/search?q=test");

    expect(screen.getByText("testUser")).toBeInTheDocument();
    expect(screen.getByText("testCluck")).toBeInTheDocument();
  });

  it("handles search error", async () => {
    axios.get.mockRejectedValue(new Error("Search failed"));

    render(
      <Router>
        <SearchBar />
      </Router>
    );

    fireEvent.change(screen.getByTestId("search-field"), {
      target: { value: "test" },
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    expect(axios.get).toHaveBeenCalledWith("/search?q=test");

    expect(screen.getByText("Error: Search failed")).toBeInTheDocument();
  });
});
