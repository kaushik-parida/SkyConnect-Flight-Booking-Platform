import { render,screen,fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { MemoryRouter } from "react-router-dom"; 
test("renders login inputs",()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
test("shows error if fields are empty",()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
});
test("does not login when only email is entered",async()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText(/email/i),"user@gmail.com");
    await userEvent.click(screen.getByRole("button",{name:/login/i}));
    expect(
        await screen.findByText(/please enter email and password/i)).toBeInTheDocument();
        expect(localStorage.getItem("isLoggedIn")).toBe(null);
});
test("does not login only when password is entered",async()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText(/password/i),"1234");
    await userEvent.click(screen.getByRole("button",{name:/login/i}));
    expect(
        await screen.findByText(/please enter email and password/i)).toBeInTheDocument();
        expect(localStorage.getItem("isLoggedIn")).toBe(null);
});
test("logs in as normal user",async()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText(/email/i),"user@gmail.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i),"1234");
    await userEvent.click(screen.getByRole("button",{name:/login/i}));
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("role")).toBe("USER");
});
test("logs in as admin",async()=>{
    render(<MemoryRouter><LoginPage/></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText(/email/i),"admin@gmail.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i),"1234");
    await userEvent.click(screen.getByRole("button",{name:/login/i}));
    expect(localStorage.getItem("role")).toBe("ADMIN");
});
