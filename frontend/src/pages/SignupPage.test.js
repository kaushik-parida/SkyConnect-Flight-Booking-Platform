import { render,screen,fireEvent } from "@testing-library/react";
import SignupPage from "./SignupPage";
import { BrowserRouter } from "react-router-dom";
test("renders signup form",()=>{
    render(<BrowserRouter><SignupPage/></BrowserRouter>);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
test("shows validation message",()=>{
    render(<BrowserRouter><SignupPage/></BrowserRouter>);
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
});