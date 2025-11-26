import User from "../models/user.js";
import { ValidateLogin, ValidateSignUp, HashedPassword, ComparePassword, GenerateToken, GenerateRefreshToken } from "../helpers/helper.js";

export const CreateUser = async (req, res) => {
    try {
      console.log(req.body)
        const { error} = ValidateSignUp(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                errors: error.details.map((err) => err.message),
            });
        }
        // console.log(value)
        const { Username, Email, Password } = req.body;

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errors: ["User already exists"],
            });
        }

        const hashedPassword = await  HashedPassword(Password);

        const newUser = new User({
            Username,
            Email,
            Password: hashedPassword,
        });

        const token = GenerateToken({
            _id: newUser._id,
            Username,
            Email,
        });

        const refreshToken = GenerateRefreshToken({
            _id: newUser._id,
            Username,
            Email,
        });

        newUser.Token = token;
        newUser.RefreshToken = refreshToken;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                Username: newUser.Username,
                Email: newUser.Email,
                Token: token,
                RefreshToken: refreshToken,
            },
        });
    } catch (error) {
        console.error(error);
        console.log("Error in Create User");
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};
export const LoginUser = async (req, res) => {
  try {
    const { error } = ValidateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isPasswordCorrect = ComparePassword(user.Password, Password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }

    const token = GenerateToken({
      _id: user._id,
      Username: user.Username,
      Email: user.Email,
    });

    const refreshToken = GenerateRefreshToken({
      _id: user._id,
      Username: user.Username,
      Email: user.Email,
    });

    user.Token = token;
    user.RefreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        Username: user.Username,
        Email: user.Email,
        Token: token,
        RefreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    console.log("Error in Login User");
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
export const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful — tokens cleared",
    });
  } catch (error) {
    console.error( error);
    console.log("Error in Logout User");
    return res.status(500).json({
      success: false,
      message: "Error in Logout User",
    });
  }
};
