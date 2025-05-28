import jwt from "jsonwebtoken";
import UserModel from "@/model/UserModel";


interface Payload {
  email: string;
  create_time: Date;
  _id?:string
}

interface AuthResponse {
  authenticated: boolean;
  user: Payload | null;
  usertype: string | null;
  message: string;
}

export const authenticateAndValidateUser = async (req: Request): Promise<AuthResponse> => {

  try {

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "Authorization header missing or invalid",
      };
    }

    
    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "Token missing in authorization header",
      };
    }

    
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key is not set in environment variables.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as Payload;

    const user = await UserModel.findOne({ email: decoded.email }).select('-password -address -accept_terms_conditions_privacy_policy -subscribe_email -profile -verify_code');

    if (!user) {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "User not found",
      };
    }

    if (user?.user_status == 'REMOVED') {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "User is remove",
      };
    }

    let usertype: string | null = null;
    if (user.role === "admin") {
      usertype = "admin";
    } else if (user.role === "data_editor") {
      usertype = "data_editor";
    } else if (user.role === "blog_editor") {
      usertype = "blog_editor";
    }else if (user.role === "user") {
      usertype = "user";
    }

    return {
      authenticated: true,
      user: user,
      usertype,
      message: "User authenticated and validated successfully",
    };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
  
    if (error.name === "TokenExpiredError") {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "Token has expired",
      };
    } else if (error.name === "JsonWebTokenError") {
      return {
        authenticated: false,
        user: null,
        usertype: null,
        message: "Invalid token",
      };
    }

   
    return {
      authenticated: false,
      user: null,
      usertype: null,
      message: "Authentication and validation failed: " + error.message,
    };
  }
};