const authService = require("../services/authService");

exports.login = async (request, response) => {
  try {
    const data = await authService.login(request.body);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Login failed";
    response.status(status).json({ message });
  }
};

exports.register = async (request, response) => {
  try {
    const data = await authService.register(request.body);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Registration failed";
    response.status(status).json({ message });
  }
};

exports.getAllUsers = async (request, response) => {
  try {
    const data = await authService.getAllUsers();
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch users";
    response.status(status).json({ message });
  }
};