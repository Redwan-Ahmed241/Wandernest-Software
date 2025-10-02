import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // The app should render a loading spinner initially due to lazy loading
  const loadingSpinner =
    screen.getByTestId("loading-spinner") || screen.getByRole("generic");
  expect(loadingSpinner).toBeInTheDocument();
});

test("app renders loading spinner initially", async () => {
  render(<App />);

  // Check for the loading spinner with the specific classes
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeInTheDocument();

  // You can add more specific tests here as needed
});
