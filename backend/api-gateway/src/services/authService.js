const authRepo = require("../repositories/authRepository");

exports.login = async (data) => {
    return await authRepo.login(data);
};