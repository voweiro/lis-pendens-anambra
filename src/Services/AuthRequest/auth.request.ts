import axios from "axios";

// Define types for the body of the requests
interface SignUpIndividualBody {
  name: string;
  email: string;
  password: string;
  // Add other fields as needed
}

interface SignUpBusinessBody {
  businessName: string;
  email: string;
  password: string;
  // Add other fields as needed
}

interface LoginBody {
  email: string;
  password: string;
}

interface ForgotPasswordBody {
  email: string;
}

// Define the response structure for each request
interface SignUpResponse {
  message: string;
  data: any; // Replace with actual response data type
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface LogoutResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

// Base URL for API
const baseURL = process.env.NEXT_PUBLIC_BASEURL;

// SIGNUP REQUEST FOR INDIVIDUAL
export const SignUpRequestForIndividual = async (body: SignUpIndividualBody): Promise<SignUpResponse | undefined> => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// SIGNUP REQUEST FOR BUSINESS
export const SignUpRequestForBusiness = async (body: SignUpBusinessBody): Promise<SignUpResponse | undefined> => {
  try {
    const response = await axios.post(`${baseURL}/auth/business/register`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// LOGIN REQUEST
export const LoginRequest = async (body: LoginBody): Promise<LoginResponse | undefined> => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log(data, "====== Data is here ======");
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// LOGOUT
export const LogOutRequest = async (body: unknown): Promise<LogoutResponse | undefined> => {
  try {
    const response = await axios.get(`${baseURL}/auth/logout`, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log(data, "====== Data is here ======");
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// FORGOT PASSWORD REQUEST
export const ForgotPasswordRequest = async (body: ForgotPasswordBody): Promise<ForgotPasswordResponse | undefined> => {
  try {
    const response = await axios.post(`${baseURL}/auth/password/request`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
