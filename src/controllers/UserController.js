const UserServices = require('../services/UserServices');
const JwtServices = require('../services/JWTServices');

const createUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is email',
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The password is not equal confirmPassword',
      });
    }

    const data = await UserServices.createUser(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is email',
      });
    }

    const response = await UserServices.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    return res.status(200).json({ ...newResponse, refresh_token });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }
    const response = await UserServices.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }
    const response = await UserServices.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!ids) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The ids is required',
      });
    }
    const response = await UserServices.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserServices.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }

    const response = await UserServices.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.headers.token.split(' ')[1];
    if (!token) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The token is required',
      });
    }
    const response = await JwtServices.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({
      status: 'OK',
      message: 'Logout successfully',
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
  deleteMany,
};
