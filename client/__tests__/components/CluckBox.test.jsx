import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import CluckBox from "../../src/components/CluckBox";
import { UpdateClucksContext } from "../../src/contexts/UpdateClucksContext";
import { LoggedInContext } from "../../src/contexts/LoggedInContext";

vitest.mock("react-router-dom", async () => {
  const module = await import("../helpers/react-router-dom.mock");
  return module.default || module;
});
vitest.mock("axios");

afterEach(() => {
  cleanup();
  vitest.clearAllMocks();
});

describe("CluckBox", () => {
  const user = {
    _id: "1",
    userName: "TestUser",
  };

  const now = new Date().toISOString();

  const cluck = {
    _id: "1",
    text: "Test cluck",
    user: user,
    likedBy: [],
    replies: ['2'],
    createdAt: now,
    updatedAt: now,
  };

  // Mock the context providers
  const mockUpdateCluck = vitest.fn();
  const mockUserId = user._id;

  let renderResult;

  beforeEach(() => {
    renderResult = render(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: mockUserId }}>
          <CluckBox cluck={cluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
  });

  it("renders without crashing", () => {
    expect(renderResult.getByText("Test cluck")).toBeInTheDocument();
  });

  it("does not show last edited if the cluck has not been updated", () => {
    expect(renderResult.queryByTestId("last-edited")).not.toBeInTheDocument();
  });

  it("shows last edited if the cluck has been updated", () => {
    const updatedCluck = {
      ...cluck,
      updatedAt: new Date().toISOString(),
    };

    // Rerender CluckBox to show the last edited time
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: mockUserId }}>
          <CluckBox cluck={updatedCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
    expect(renderResult.getByTestId("last-edited")).toBeInTheDocument();
  });

  it("handles like correctly", async () => {
    let testCluck = cluck;
    axios.patch.mockImplementation((url, data) => {
      testCluck = { ...testCluck, ...data };
      return Promise.resolve({ status: 200 });
    });

    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={testCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );

    fireEvent.click(renderResult.getByTestId("like-button"));

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toHaveBeenCalledWith(
      "/clucks/like/1",
      { liked: true },
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
    );

    testCluck = { ...testCluck, likedBy: ["2"] };

    // Rerender CluckBox with the updated cluck text
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={testCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );

    const likeButton = renderResult.getByTestId("like-button");
    expect(likeButton).toBeInTheDocument();
    expect(likeButton).toHaveTextContent("1");
  });

  it("handles unlike correctly", async () => {
    let testCluck = { ...cluck, likedBy: ["2"] };
    axios.patch.mockImplementation((url, data) => {
      testCluck = { ...testCluck, ...data };
      return Promise.resolve({ status: 200 });
    });

    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={testCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );

    fireEvent.click(renderResult.getByTestId("like-button"));

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toHaveBeenCalledWith(
      "/clucks/like/1",
      { liked: false },
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
    );

    testCluck = { ...testCluck, likedBy: [] };

    // Rerender CluckBox with the updated cluck text
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={testCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );

    const likeButton = renderResult.getByTestId("like-button");
    expect(likeButton).toBeInTheDocument();
    expect(likeButton).toHaveTextContent("0");
  });

  it("handles edit correctly", async () => {
    let testCluck = cluck;
    axios.patch.mockImplementation((url, data) => {
      testCluck = { ...testCluck, ...data };
      return Promise.resolve({ status: 200 });
    });

    fireEvent.click(renderResult.getByTestId("edit-button"));
    fireEvent.change(renderResult.getByRole("textbox"), {
      target: { value: "Updated cluck" },
    });
    fireEvent.click(renderResult.getByText("Save"));

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toHaveBeenCalledWith(
      "/clucks/1",
      { text: "Updated cluck" },
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
    );

    // Rerender CluckBox with the updated cluck text
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: mockUserId }}>
          <CluckBox cluck={testCluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );

    await waitFor(() =>
      expect(renderResult.getByTestId("cluck-text")).toHaveTextContent(
        "Updated cluck"
      )
    );
  });

  it("does not show edit and delete buttons if the user is not the author", () => {
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={cluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
    expect(renderResult.queryByTestId("edit-button")).not.toBeInTheDocument();
    expect(renderResult.queryByTestId("delete-button")).not.toBeInTheDocument();
  });

  it("does show like button if the user is not the author", () => {
    renderResult.rerender(
      <UpdateClucksContext.Provider value={{ updateCluck: mockUpdateCluck }}>
        <LoggedInContext.Provider value={{ userId: "2" }}>
          <CluckBox cluck={cluck} />
        </LoggedInContext.Provider>
      </UpdateClucksContext.Provider>
    );
    expect(renderResult.queryByTestId("like-button")).toBeInTheDocument();
  });

  it("does not show like button if the user is the author", () => {
    expect(renderResult.queryByTestId("like-button")).not.toBeInTheDocument();
  });

  it("shows edit and delete buttons if the user is the author", () => {
    expect(renderResult.queryByTestId("edit-button")).toBeInTheDocument();
    expect(renderResult.queryByTestId("delete-button")).toBeInTheDocument();
  });

  it('shows replies and reply button correctly', () => {
    expect(renderResult.queryByTestId('reply-button')).toBeInTheDocument();
    expect(renderResult.queryByTestId('replies-button')).toBeInTheDocument();
  });

  it('show all replies when clicked on Show replies', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          _id: '13',
          text: 'Test cluck 3',
          user: user,
          likedBy: [],
          replies: [],
          replyTo: ['1'],
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    fireEvent.click(renderResult.getByTestId('replies-button'));

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith('/clucks/replies/1');
    expect(renderResult.queryByTestId('replies-button')).toHaveTextContent(
      'Hide Replies (1)'
    );
  });

  it('handles delete correctly', async () => {
    axios.delete.mockResolvedValue({
      status: 200,
    });

    fireEvent.click(renderResult.getByTestId("delete-button"));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(axios.delete).toHaveBeenCalledWith(
      "clucks/1",
      expect.objectContaining({ withCredentials: true })
    );

    expect(renderResult.queryByTestId("cluck-box")).not.toBeInTheDocument();
  });
});
