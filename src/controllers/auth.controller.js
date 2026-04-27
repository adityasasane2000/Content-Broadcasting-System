import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await registerUser({ name, email, password, role });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};

// export const getMe = async (req, res) => {
//   try {
//     return res.status(200).json({
//       user: req.user, // will come from middleware
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to fetch user",
//     });
//   }
// };