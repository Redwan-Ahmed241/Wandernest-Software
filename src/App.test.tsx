import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import App from "./App";

test("renders app without crashing", async () => {
  await act(async () => {
    render(<App />);
  });

  // Wait for the app to finish loading
  await waitFor(() => {
    // Check if we can find the navbar with WanderNest logo (use getAllByAltText to handle multiple)
    const wanderNestLogos = screen.getAllByAltText("WanderNest");
    expect(wanderNestLogos.length).toBeGreaterThan(0);
    expect(wanderNestLogos[0]).toBeInTheDocument();
  });
});

test("app loads main navigation elements", async () => {
  await act(async () => {
    render(<App />);
  });

  // Wait for navigation elements to load and use more specific selectors
  await waitFor(() => {
    // Look for buttons specifically in the navigation
    const navButtons = screen.getAllByRole("button");
    const buttonTexts = navButtons.map((button) => button.textContent);

    expect(buttonTexts).toContain("Destinations");
    expect(buttonTexts).toContain("Hotels");
    expect(buttonTexts).toContain("Flights");
    expect(buttonTexts).toContain("Log in");
    expect(buttonTexts).toContain("Sign up");
  });
});
