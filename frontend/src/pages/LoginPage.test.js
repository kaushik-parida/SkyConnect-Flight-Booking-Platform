import { render,screen,fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { BrowserRouter } from "react-router-dom";
test("renders login inputs",()=>{
    render(<BrowserRouter><LoginPage/></BrowserRouter>);
expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
test("shows error if fields are empty",()=>{
    render(<BrowserRouter><LoginPage/></BrowserRouter>);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
});
