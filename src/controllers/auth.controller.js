import usermodel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { resolveSoa } from "dns";

export async function register(req, res) {

  const { username, email, password } = req.body;
  const isAlreadyRegistered = await usermodel.findOne({
    $or: [
      {username},
      {email}
    ]
  });
  if (isAlreadyRegistered) {
    return res.status(409).json({
      message:"username or email is already existed"
    });
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  const user = await usermodel.create({
    username,
    email,
    password: hashedPassword
  });

  const accessToken = jwt.sign({
    id: user._id
  }, config.JWT_secret, {
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign({
    id:user.id
  }, config.JWT_secret,
  {
    expiresIn:"7d"
  }

)

res.cookie("refreshToken", refreshToken,{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7days 
})

  return res.status(201).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
      accessToken,
  });
}


export async function getme(req,res) {

  const token = req.get("authorization")?.split(" ")[1];
  
  if (!token){
    return res.status(401).json({
      message: "token not found"
    })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_secret);
    const user = await usermodel.findById(decoded.id).select("username email");

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: "invalid or expired token"
    });
  }

}
export default register;
export async function refreshToken(req, res) {
  const rawRefreshToken = req.cookies?.refreshToken
    || req.cookies?.refreshtoken
    || req.get("x-refresh-token")
    || req.body?.refreshToken;
  const refreshToken = rawRefreshToken?.replace(/^Bearer\s+/i, "").trim();

  if(!refreshToken){
    return res.status(401).json({
      message: "refresh token not found"
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_secret);
    const accessToken = jwt.sign({
      id: decoded.id
    }, config.JWT_secret, {
      expiresIn: "15m"
    });

    return res.status(200).json({
      message: "access token refreshed",
      accessToken
    });
  } catch (error) {
    return res.status(401).json({
      message: "invalid or expired refresh token"
    });
  }
}