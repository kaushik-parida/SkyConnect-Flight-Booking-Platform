import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
test("renders navbar title", () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  expect(screen.getByText(/enjoy trip/i)).toBeInTheDocument();
});