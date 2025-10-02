import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // Check if the app renders - could be loading spinner or main content
  const appElement = document.body.firstChild;
  expect(appElement).toBeInTheDocument();
});

test("app renders main layout components", async () => {
  await act(async () => {
    render(<App />);
  });

  // Wait for the main components to render
  await waitFor(() => {
    // Check for navbar (which should always be present)
    const navbar = document.querySelector("nav");
    expect(navbar).toBeInTheDocument();
    
    // Check for the main layout
    const layout = document.querySelector(".flex.flex-col.min-h-screen");
    expect(layout).toBeInTheDocument();
  });
});
