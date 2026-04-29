import {render,screen,fireEvent} from "@testing-library/react";
import FlightSearch from "./FlightSearch";
import { BrowserRouter } from "react-router-dom";
test("renders flight search fields",()=>{
    render(<BrowserRouter><FlightSearch/></BrowserRouter>);
    expect(screen.getByText(/search flights/i)).toBeInTheDocument();
});
test("shows error if fields are empty",()=>{
    localStorage.setItem("isLoggedIn", "true");
    render(<BrowserRouter><FlightSearch/></BrowserRouter>);
    fireEvent.click(screen.getByRole("button", { name: /search flights/i }));
    expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
});