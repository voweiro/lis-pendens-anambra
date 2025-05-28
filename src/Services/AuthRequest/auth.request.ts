import axios from "axios";

// Define types for the body of the requests
interface SignUpIndividualBody {
  type: string; // "individual" or "business"
  name: string;
  email: string;
  phone_number?: string;
  dob?: string;
  password: string;
  // Add other fields as needed
}

interface SignUpBusinessBody {
  type: string; // Always "company"
  name: string; // Company name
  email: string;
  phone_number?: string;
  dob?: string; // Date of birth or company establishment date
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
  status: boolean;
  message: string;
  role: string;
  data: {
    id: number;
    user_type: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    email: string;
    phone: string;
    date_of_birth: string;
    email_verified_at: string;
    verification_code: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  user_id: number;
  token: string;
}

interface LogoutResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

// Interface for update profile request
interface UpdateProfileParams {
  password?: string;
  password_confirmation?: string;
  name?: string;
  dob?: string;
}

// Interface for court registrar settings update
interface UpdateCourtRegistrarSettingsParams {
  password?: string;
  password_confirmation?: string;
  court_info?: string;
  court_number?: string;
  judicial_division?: string;
}

// Interface for super admin settings update
interface UpdateSuperAdminSettingsParams {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  dob?: string;
}

// Interface for search request
interface SearchRequestParams {
  lga_id: string;
  state_id: string;
  payment_method: string;
  title_type?: string;
  lga?: string;
  state?: string;
  register_title?: string;
  plot_number?: string;
  plot_street_name?: string;
  city?: string;
  survey_plan_number?: string;
  property_owner?: string;
}

// Interface for the new search request
export interface NewSearchRequestParams extends SearchRequestParams {
  // Additional fields for the new search API
  property_address?: string;
  property_description?: string;
  search_reference?: string;
}

interface VerifyTokenRequestParams {
  token: string;
  type: "REGISTER" | "PASSWORD_RESET";
}

// Interface for resend verification code request
interface ResendVerificationCodeParams {
  email: string;
  type: "REGISTER" | "PASSWORD_RESET";
}

// Interface for reset password request
interface ResetPasswordParams {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// Base URL for API
const baseURL = process.env.NEXT_PUBLIC_URL;
console.log(baseURL, "Base URL is here");

// SIGNUP REQUEST FOR INDIVIDUAL
export const SignUpRequestForIndividual = async (
  body: SignUpIndividualBody
): Promise<SignUpResponse | undefined> => {
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
export const SignUpRequestForBusiness = async (
  body: SignUpBusinessBody
): Promise<SignUpResponse | undefined> => {
  try {
    // Use the same endpoint as individual signup
    const response = await axios.post(`${baseURL}/auth/register`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log(data, "Company signup response:");
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error("Company signup error:", error);
    throw error;
  }
};

// Get the appropriate redirect path based on user type
export const getUserRedirectPath = (userType: string): string => {
  console.log("Getting redirect path for user type:", userType);

  // Convert to lowercase for case-insensitive comparison
  const type = userType.toLowerCase();

  if (type === "admin") {
    return "/Super-admin";
  } else if (type === "registrar" || type === "court_staff") {
    return "/court-registrar";
  } else if (type === "company" || type === "user_company") {
    return "/users";
  } else if (type === "individual" || type === "user_individual") {
    return "/users";
  } else {
    // Default path for any other user type
    console.log("Unknown user type, defaulting to /users");
    return "/users";
  }
};

// LOGIN REQUEST
export const LoginRequest = async (
  body: LoginBody
): Promise<LoginResponse | undefined> => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, body, {
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    });
    const responseData = response.data;
    console.log(responseData, "====== Login response data ======");

    if (!responseData) return undefined;

    // Extract user type for redirection
    let userType = "";
    if (responseData.data && responseData.data.type) {
      // Based on the Postman example, the type is in data.type
      userType = responseData.data.type;
      console.log("Found user type in data.type:", userType);
    } else if (responseData.data && responseData.data.user_type) {
      userType = responseData.data.user_type;
      console.log("Found user type in data.user_type:", userType);
    } else if (responseData.user_type) {
      userType = responseData.user_type;
      console.log("Found user type in user_type:", userType);
    } else if (responseData.role) {
      userType = responseData.role;
      console.log("Found user type in role:", userType);
    } else if (responseData.type) {
      userType = responseData.type;
      console.log("Found user type in type:", userType);
    }

    console.log("Extracted user type for redirection:", userType);

    // Based on the Postman response, the token is inside the data object
    // Structure: { success: true, message: string, data: { id, name, email, ..., token } }
    let token = null;
    if (responseData.data && responseData.data.token) {
      token = responseData.data.token;
      console.log("Found token in response data.data.token:", token);
    } else if (responseData.token) {
      token = responseData.token;
      console.log("Found token in response data.token:", token);
    }

    if (token) {
      // Save the auth token in multiple formats for compatibility
      // 1. Save the entire response
      sessionStorage.setItem("auth", JSON.stringify(responseData));

      // 2. Save just the token
      sessionStorage.setItem("token", token);

      // 3. Save the user data
      if (responseData.data) {
        sessionStorage.setItem("user", JSON.stringify(responseData.data));
      }

      // 4. Save in a format that UpdateProfileRequest expects
      const authData = {
        token: token,
        data: responseData.data || responseData,
      };
      sessionStorage.setItem("authData", JSON.stringify(authData));

      console.log("Auth data saved to session storage");
      console.log(
        "User should be redirected to:",
        getUserRedirectPath(userType)
      );
    } else {
      console.error(
        "User data not found in expected location. Response structure:",
        responseData
      );
    }

    return responseData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// LOGOUT
export const LogOutRequest = async (
  body: unknown
): Promise<LogoutResponse | undefined> => {
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
export const ForgotPasswordRequest = async (
  body: ForgotPasswordBody
): Promise<ForgotPasswordResponse | undefined> => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/password/request`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (!data) return undefined;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Verify token API request
export const VerifyTokenRequest = async (params: VerifyTokenRequestParams) => {
  try {
    console.log("Verifying token with params:", params);
    console.log("Using base URL:", baseURL);

    // Use axios instead of fetch to handle CORS better
    const response = await axios.post(`${baseURL}/auth/verify-token`, params, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("Token verification response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Token verification error:",
      error.response?.data || error.message
    );
    // Format error to match expected structure
    if (error.response) {
      throw { response: { data: error.response.data } };
    }
    throw error;
  }
};

// Resend verification code API request
export const ResendVerificationCodeRequest = async (
  params: ResendVerificationCodeParams
) => {
  try {
    console.log("Resending verification code with params:", params);
    console.log("Using base URL:", baseURL);

    // Try multiple possible endpoint URLs since the correct one may vary
    const possibleEndpoints = [
      "/auth/resend-token", // Most likely correct endpoint
      // Common Laravel endpoint
    ];

    let response = null;
    let lastError = null;

    // Try each endpoint until one works
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${baseURL}${endpoint}`);
        response = await axios.post(`${baseURL}${endpoint}`, params, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log(`Success with endpoint: ${endpoint}`);
        break; // Exit loop if successful
      } catch (error: any) {
        console.log(
          `Failed with endpoint: ${endpoint}`,
          error.response?.status
        );
        lastError = error;
        // Continue to next endpoint
      }
    }

    // If all endpoints failed, throw the last error
    if (!response) {
      throw (
        lastError || new Error("All resend verification code endpoints failed")
      );
    }

    console.log("Resend verification code response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Resend verification code error:",
      error.response?.data || error.message
    );
    // Format error to match expected structure
    if (error.response) {
      throw { response: { data: error.response.data } };
    }
    throw error;
  }
};

// Reset Password Request
export const ResetPasswordRequest = async (params: ResetPasswordParams) => {
  try {
    console.log("Resetting password with params:", params);
    console.log("Using base URL:", baseURL);

    // Use axios instead of fetch to handle CORS better
    const response = await axios.post(
      `${baseURL}/auth/reset-password`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Reset password response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Reset password error:",
      error.response?.data || error.message
    );
    // Format error to match expected structure
    if (error.response) {
      throw { response: { data: error.response.data } };
    }
    throw error;
  }
};

// UPDATE PROFILE REQUEST
export const UpdateProfileRequest = async (params: UpdateProfileParams) => {
  try {
    console.log("Updating profile with params:", params);

    // Create form data from params
    const formData = new FormData();

    // Add each parameter to form data if it exists
    if (params.password) formData.append("password", params.password);
    if (params.password_confirmation)
      formData.append("password_confirmation", params.password_confirmation);
    if (params.name) formData.append("name", params.name);
    if (params.dob) formData.append("dob", params.dob);

    // Get authentication token from session storage - based on the structure from login response
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);
          console.log("Auth data from session storage:", auth);

          // Based on the Postman response structure
          if (auth.data && auth.data.token) {
            authToken = auth.data.token;
            console.log("Found token in auth.data:", authToken);
          } else if (auth.token) {
            authToken = auth.token;
            console.log("Found token at auth.token:", authToken);
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    // If still no token, try the authData object
    if (!authToken) {
      const authDataStr = sessionStorage.getItem("authData");
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          if (authData.token) {
            authToken = authData.token;
            console.log("Found token in authData:", authToken);
          }
        } catch (error) {
          console.error("Error parsing authData:", error);
        }
      }
    }

    // Last resort: check if user object has token
    if (!authToken) {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData.token) {
            authToken = userData.token;
            console.log("Found token in user data:", authToken);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    if (!authToken) {
      console.error("Authentication token not found in any storage location");
      throw new Error("Authentication token not found. Please log in again.");
    }

    // Make the API call
    const response = await fetch(`${baseURL}/profile/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    const data = await response.json();
    console.log("Profile update response:", data);

    // Update the session storage with the updated user data
    if (data && data.success) {
      try {
        // Update user data in session storage
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);

          // Update the user data with the new values from params
          if (params.name) userData.name = params.name;
          if (params.dob) userData.date_of_birth = params.dob;

          // Save the updated user data back to session storage
          sessionStorage.setItem("user", JSON.stringify(userData));
          console.log("Updated user data in session storage:", userData);
        }

        // Also update the auth object if it exists
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          const auth = JSON.parse(authStr);

          if (auth.data) {
            // Update the auth data with the new values
            if (params.name) auth.data.name = params.name;
            if (params.dob) auth.data.date_of_birth = params.dob;

            // Save the updated auth data back to session storage
            sessionStorage.setItem("auth", JSON.stringify(auth));
            console.log("Updated auth data in session storage:", auth);
          }
        }
      } catch (error) {
        console.error(
          "Error updating session storage after profile update:",
          error
        );
      }
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// SEARCH REQUEST - INITIATE SEARCH
export const SearchRequest = async (params: SearchRequestParams) => {
  try {
    console.log("Initiating search with params:", params);

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Create search data object with required parameters
    const searchData = {
      lga_id: params.lga_id,
      state_id: params.state_id,
      payment_method: params.payment_method || "paystack",
      title_type: params.title_type || "",
      lga: params.lga || "",
      state: params.state || "",
      register_title: params.register_title || "",
      plot_number: params.plot_number || "",
      plot_street_name: params.plot_street_name || "",
      city: params.city || "",
      survey_plan_number: params.survey_plan_number || "",
      property_owner: params.property_owner || "",
    };

    // Make the API call using axios to the new endpoint
    const response = await axios.post(
      `${baseURL}/user/search/initiate`,
      searchData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Search initiate response:", data);

    // Extract search ID from the response
    const searchId = data.data?.search_id || data.search_id || data.id;

    if (searchId) {
      console.log("Search initiated successfully with ID:", searchId);
      // Store search ID in session storage for later use
      sessionStorage.setItem("currentSearchId", searchId.toString());
    }

    return data;
  } catch (error) {
    console.error("Error initiating search:", error);
    throw error;
  }
};

// This function has been replaced by the updated SearchRequest function above

// FINALIZE SEARCH
export const finalizeSearch = async (
  reference: string,
  caseId: string | number
) => {
  try {
    console.log(
      "Finalizing search with reference:",
      reference,
      "and case ID:",
      caseId
    );

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Make the API call using axios to the finalize search endpoint shown in Postman
    const response = await axios.post(
      `${baseURL}/user/search/finalize`,
      {
        reference: reference,
        case_id: caseId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Finalize search response:", data);

    return data;
  } catch (error) {
    console.error("Error finalizing search:", error);
    throw error;
  }
};

// GET SEARCH HISTORY
export const GetSearchHistory = async (id?: string) => {
  try {
    // Get the user ID from session storage for authentication
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Make the API call using axios with the correct endpoint
    console.log(
      `Fetching search history with token: ${authToken.substring(0, 10)}...`
    );
    const endpoint = "/user/search";
    const url = id ? `${baseURL}${endpoint}?id=${id}` : `${baseURL}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    console.log("Search history response:", data);

    return data;
  } catch (error) {
    console.error("Error getting search history:", error);
    throw error;
  }
};

// GET SEARCH HISTORY BY ID
export const GetSearchHistoryById = async (searchId: string) => {
  try {
    console.log(`Fetching search history by ID: ${searchId}`);
    const baseURL = process.env.NEXT_PUBLIC_URL || "";

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Use the exact endpoint from the screenshot
    const endpoint = `/api/search/history/by/id?id=${searchId}`;

    console.log(`Making API request to: ${baseURL}${endpoint}`);
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    console.log("Search history by ID response:", data);

    return data;
  } catch (error) {
    console.error("Error getting search history by ID:", error);
    throw error;
  }
};

// GET SEARCH BY ID
export const GetSearchById = async (searchId: string) => {
  try {
    // Get the user ID from session storage for authentication
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Make the API call using axios to the correct endpoint
    console.log(`Fetching search by ID: ${searchId}`);

    // Try multiple endpoints based on the screenshot
    const endpoints = [
      `/api/search/history/by/id?id=${searchId}`,
      `/user/search/history/by/id?id=${searchId}`,
      `/user/search/${searchId}`,
    ];

    let response = null;
    let lastError = null;

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${baseURL}${endpoint}`);
        response = await axios.get(`${baseURL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log(`Success with endpoint: ${endpoint}`);
        break; // Exit loop if successful
      } catch (error) {
        console.log(`Failed with endpoint: ${endpoint}`, error);
        lastError = error;
      }
    }

    // If all attempts failed, throw the last error
    if (!response) {
      throw lastError || new Error("All search by ID API endpoints failed");
    }

    const data = response.data;
    console.log("Search by ID response:", data);

    return data;
  } catch (error) {
    console.error("Error getting search by ID:", error);
    throw error;
  }
};

// GET STATES
export const GetStates = async () => {
  try {
    console.log("Making API call to get states...");
    console.log("Base URL:", baseURL);

    // Get auth token for authenticated requests
    let authToken = null;
    const tokenStr = sessionStorage.getItem("token");
    const authStr = sessionStorage.getItem("auth");

    if (tokenStr) {
      authToken = tokenStr;
    } else if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.token) authToken = auth.token;
        else if (auth.accessToken) authToken = auth.accessToken;
        else if (auth.data && auth.data.token) authToken = auth.data.token;
      } catch (e) {
        console.error("Error parsing auth:", e);
      }
    }

    // Try both with and without authentication
    let response;
    try {
      // First try with authentication
      if (authToken) {
        console.log("Trying with authentication");
        response = await axios.get(`${baseURL}/states`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error("No auth token found");
      }
    } catch (authError) {
      console.log("Auth request failed, trying without authentication");
      // If that fails, try without authentication
      response = await axios.get(`${baseURL}/states`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    }

    const data = response.data;
    console.log("States response:", data);

    // Handle different response formats
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((state: any) => ({
        id: state.id.toString(),
        label: state.name,
        active: true,
      }));
    } else if (Array.isArray(data)) {
      return data.map((state: any) => ({
        id: state.id?.toString() || state.state_id?.toString() || "0",
        label: state.name || state.state || "",
        active: true,
      }));
    }

    console.warn("Unexpected state data format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching states:", error);
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
};

// Interface for case item structure
interface CaseItem {
  id?: string | number;
  _id?: string | number;
  title?: string;
  tile?: string;
  address?: string;
  status?: string;
  owner_name?: string;
  suit_number?: string;
  title_number?: string;
  survey_plan_number?: string;
  street?: string;
  city?: string;
  plot_number?: string;
  parties?: string;
  name_of_parties?: string;
  subject_matter?: string;
  description_of_properties?: string;
  court_details?: string;
  nature_of_case?: string;
  date_of_commencement?: string;
  date_of_disposal?: string;
  user_id?: string | number;
  judicial_division_id?: string | number;
  state_id?: string | number;
  lga_id?: string | number;
  created_at?: string;
  updated_at?: string;
}

// GET ALL CASES
export const GetAllCases = async () => {
  try {
    console.log("Fetching all cases...");
    const baseURL = process.env.NEXT_PUBLIC_URL || "";

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }

      // For testing purposes, use a mock token if no token is found
      if (!authToken) {
        console.warn("No auth token found, using mock token for development");
        authToken = "mock_token_for_development";
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return {
        success: false,
        error: "Authentication token not found",
        data: [],
      };
    }

    // Use the correct endpoint
    const endpoint = "/court-staff/cases";

    console.log(`Making API request to: ${baseURL}${endpoint}`);
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);

    // Process the response data to ensure it matches our expected format
    let casesData = [];

    if (response.data && Array.isArray(response.data)) {
      casesData = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      casesData = response.data.data;
    } else if (response.data && typeof response.data === "object") {
      // If it's a single case object, wrap it in an array
      casesData = [response.data];
    }

    // Map the API response to our expected format including ALL fields
    const formattedCases = casesData.map((caseItem: CaseItem) => ({
      id: String(caseItem.id || caseItem._id || Math.random()),
      // Handle the title/tile field (API uses 'tile' instead of 'title')
      tile: caseItem.tile || caseItem.title || "Untitled Case",
      title: caseItem.title || caseItem.tile || "Untitled Case",
      // Basic case information
      address: caseItem.address || "No address provided",
      status: (caseItem.status || "pending").toLowerCase(),
      owner_name: caseItem.owner_name || "",
      suit_number: caseItem.suit_number || "",
      // Property details
      title_number: caseItem.title_number || "",
      survey_plan_number: caseItem.survey_plan_number || "",
      street: caseItem.street || "",
      city: caseItem.city || "",
      plot_number: caseItem.plot_number || "",
      // Case details
      parties: caseItem.parties || "",
      name_of_parties: caseItem.name_of_parties || "",
      subject_matter: caseItem.subject_matter || "",
      description_of_properties: caseItem.description_of_properties || "",
      court_details: caseItem.court_details || "",
      nature_of_case: caseItem.nature_of_case || "",
      // Dates
      date_of_commencement: caseItem.date_of_commencement || "",
      date_of_disposal: caseItem.date_of_disposal || "",
      // IDs and metadata
      user_id: caseItem.user_id || "",
      judicial_division_id: caseItem.judicial_division_id || "",
      state_id: caseItem.state_id || "",
      lga_id: caseItem.lga_id || "",
      created_at: caseItem.created_at || "",
      updated_at: caseItem.updated_at || "",
    }));

    console.log("Formatted cases data:", formattedCases);
    console.log("First case with all fields:", formattedCases[0]);

    return { success: true, data: formattedCases };
  } catch (error) {
    console.error("Error in GetAllCases:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to fetch cases",
      data: [],
    };
  }
};

// UPDATE CASE
export const UpdateCase = async (caseId: string, caseData: any) => {
  try {
    console.log("Updating case with ID:", caseId);
    console.log("Case data to update:", caseData);

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return { success: false, error: "Authentication token not found" };
    }

    // Use the correct endpoint from Postman with POST method
    const response = await axios.post(
      `${baseURL}/court-staff/cases/${caseId}/update`,
      caseData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response for case update:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in UpdateCase:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to update case",
    };
  }
};

// DELETE CASE
export const DeleteCase = async (caseId: string) => {
  try {
    console.log("Deleting case with ID:", caseId);

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return { success: false, error: "Authentication token not found" };
    }

    // Use the correct endpoint from Postman with DELETE method
    const response = await axios.delete(
      `${baseURL}/court-staff/cases/${caseId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response for case deletion:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in DeleteCase:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to delete case",
    };
  }
};

// UPDATE COURT REGISTRAR SETTINGS
// Update Super Admin Settings
export const UpdateSuperAdminSettings = async (
  params: UpdateSuperAdminSettingsParams
) => {
  try {
    console.log("Updating Super Admin settings with params:", params);

    // Get auth token for authenticated requests
    let authToken = null;
    const tokenStr = sessionStorage.getItem("token");
    const authStr = sessionStorage.getItem("auth");

    if (tokenStr) {
      authToken = tokenStr;
    } else if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.token) {
          authToken = auth.token;
        } else if (auth.data && auth.data.token) {
          authToken = auth.data.token;
        } else if (auth.accessToken) {
          authToken = auth.accessToken;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    // Make API request to update Super Admin settings
    const response = await axios.post(
      `${baseURL}/Super-admin/settings`,
      params,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Super Admin settings update response:", response.data);
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "Settings updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Super Admin settings:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to update settings",
    };
  }
};

export const UpdateCourtRegistrarSettings = async (
  params: UpdateCourtRegistrarSettingsParams
) => {
  try {
    console.log("Updating court registrar settings with params:", params);

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return { success: false, error: "Authentication token not found" };
    }

    // Prepare data for API
    const formData: Record<string, string> = {};

    // Add each parameter to form data if it exists
    if (params.password) formData.password = params.password;
    if (params.password_confirmation)
      formData.password_confirmation = params.password_confirmation;
    if (params.court_info) formData.court_info = params.court_info;
    if (params.court_number) formData.court_number = params.court_number;
    if (params.judicial_division)
      formData.judicial_division = params.judicial_division;

    // Use the correct endpoint from Postman
    const response = await axios.post(`${baseURL}/profile/update`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log(
      "API Response for court registrar settings update:",
      response.data
    );

    // Update session and local storage with the new settings
    if (response.data && (response.data.success || response.data.status)) {
      try {
        // Create settings object with the updated values
        const updatedSettings: Record<string, string> = {};
        if (params.court_info) updatedSettings.court_info = params.court_info;
        if (params.court_number)
          updatedSettings.court_number = params.court_number;
        if (params.judicial_division)
          updatedSettings.judicial_division = params.judicial_division;

        // Save to localStorage for persistence across sessions
        localStorage.setItem(
          "court_registrar_settings",
          JSON.stringify(updatedSettings)
        );

        // Update user data in sessionStorage if it exists
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          const updatedUserData = { ...userData, ...updatedSettings };
          sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        }

        // Update auth data in sessionStorage if it exists
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          const authData = JSON.parse(authStr);
          if (authData.data) {
            authData.data = { ...authData.data, ...updatedSettings };
            sessionStorage.setItem("auth", JSON.stringify(authData));
          }
        }

        // Dispatch a custom event to notify components of the settings update
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("courtRegistrarSettingsUpdated", {
              detail: updatedSettings,
            })
          );
        }

        console.log("Updated court registrar settings in storage");
      } catch (err) {
        console.error("Error updating settings in storage:", err);
      }
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in UpdateCourtRegistrarSettings:", error);
    return {
      success: false,
      error:
        (error as Error).message || "Failed to update court registrar settings",
    };
  }
};

// GET JUDICIAL DIVISIONS
export const GetJudicialDivisions = async () => {
  try {
    console.log("Making API call to get judicial divisions");
    console.log("Base URL:", baseURL);

    // Get auth token for authenticated requests
    let authToken = null;
    const tokenStr = sessionStorage.getItem("token");
    const authStr = sessionStorage.getItem("auth");

    if (tokenStr) {
      authToken = tokenStr;
    } else if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.token) authToken = auth.token;
        else if (auth.accessToken) authToken = auth.accessToken;
        else if (auth.data && auth.data.token) authToken = auth.data.token;
      } catch (e) {
        console.error("Error parsing auth:", e);
      }
    }

    // Try multiple endpoint formats
    let response;
    const endpoints = ["/court-staff/judicial-divisions"];

    let lastError = null;

    // Try with authentication first
    if (authToken) {
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying authenticated endpoint: ${endpoint}`);
          response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break; // Exit loop if successful
        } catch (error) {
          console.log(`Failed with endpoint: ${endpoint}`, error);
          lastError = error;
        }
      }
    }

    // If all authenticated attempts failed, try without authentication
    if (!response) {
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying unauthenticated endpoint: ${endpoint}`);
          response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break; // Exit loop if successful
        } catch (error) {
          console.log(`Failed with endpoint: ${endpoint}`, error);
          lastError = error;
        }
      }
    }

    // If all attempts failed, throw the last error
    if (!response) {
      throw (
        lastError || new Error("All judicial divisions API endpoints failed")
      );
    }

    const data = response.data;
    console.log("Judicial divisions response:", data);

    // Handle different response formats
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((division: any) => ({
        id: division.id?.toString() || "0",
        label: division.name || division.label || "",
        active: true,
      }));
    } else if (Array.isArray(data)) {
      return data.map((division: any) => ({
        id: division.id?.toString() || division.division_id?.toString() || "0",
        label: division.name || division.label || division.division || "",
        active: true,
      }));
    }

    console.warn("Unexpected judicial divisions data format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching judicial divisions:", error);
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
};

// GET LGAS BY STATE
export const GetLGAs = async (stateId: string) => {
  try {
    console.log("Making API call to get LGAs for state ID:", stateId);
    console.log("Base URL:", baseURL);

    // Get auth token for authenticated requests
    let authToken = null;
    const tokenStr = sessionStorage.getItem("token");
    const authStr = sessionStorage.getItem("auth");

    if (tokenStr) {
      authToken = tokenStr;
    } else if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.token) authToken = auth.token;
        else if (auth.accessToken) authToken = auth.accessToken;
        else if (auth.data && auth.data.token) authToken = auth.data.token;
      } catch (e) {
        console.error("Error parsing auth:", e);
      }
    }

    // Try multiple endpoint formats
    let response;
    const endpoints = [
      `/lgas/${stateId}`, // With slash between lgas and stateId
      `/lgas?state_id=${stateId}`, // Query parameter format
      `/lgas`, // Try getting all LGAs and filter client-side
    ];

    let lastError = null;

    // Try with authentication first
    if (authToken) {
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying authenticated endpoint: ${endpoint}`);
          response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break; // Exit loop if successful
        } catch (error) {
          console.log(`Failed with endpoint: ${endpoint}`, error);
          lastError = error;
        }
      }
    }

    // If all authenticated attempts failed, try without authentication
    if (!response) {
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying unauthenticated endpoint: ${endpoint}`);
          response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break; // Exit loop if successful
        } catch (error) {
          console.log(`Failed with endpoint: ${endpoint}`, error);
          lastError = error;
        }
      }
    }

    // If all attempts failed, throw the last error
    if (!response) {
      throw lastError || new Error("All LGA API endpoints failed");
    }

    const data = response.data;
    console.log("LGAs response:", data);

    // Handle different response formats
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((lga: any) => ({
        id: lga.id?.toString() || "0",
        label: lga.name || lga.label || "",
        active: true,
      }));
    } else if (Array.isArray(data)) {
      return data.map((lga: any) => ({
        id: lga.id?.toString() || lga.lga_id?.toString() || "0",
        label: lga.name || lga.label || lga.lga || "",
        active: true,
      }));
    } else if (data && typeof data === "object") {
      // Try to extract LGAs from other possible formats
      const possibleArrays = Object.values(data).filter((val) =>
        Array.isArray(val)
      );
      if (possibleArrays.length > 0) {
        const lgaArray = possibleArrays[0] as any[];
        return lgaArray.map((lga: any) => ({
          id: lga.id?.toString() || lga.lga_id?.toString() || "0",
          label: lga.name || lga.label || lga.lga || "",
          active: true,
        }));
      }
    }

    console.warn("Unexpected LGA data format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching LGAs:", error);
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
};

// SHOW SEARCH
export const showSearch = async (reference: string) => {
  try {
    console.log("Showing search with reference:", reference);

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);
          console.log("Auth object from session storage:", auth);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    console.log("Using auth token:", authToken.substring(0, 10) + "...");
    console.log("API URL:", `${baseURL}/user/search/show`);

    // Make the API call using axios to the show search endpoint as shown in Postman
    const response = await axios.post(
      `${baseURL}/user/search/show`,
      { reference: reference },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw API response:", response);

    // Check if we have a valid response
    if (!response || !response.data) {
      throw new Error("Empty response from API");
    }

    const data = response.data;
    console.log("Show search response data:", data);

    // If the API returns an error message but with a 200 status code
    if (data.error || (data.message && !data.status)) {
      throw new Error(data.message || data.error || "API returned an error");
    }

    // If we have search results in the response, log them
    if (data.data) {
      console.log("Search results found:", data.data);
    }

    return data;
  } catch (error) {
    console.error("Error showing search:", error);
    // Add more context to the error
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

// VERIFY PAYMENT
export const VerifyPayment = async (reference: string) => {
  try {
    console.log("Verifying payment with reference:", reference);

    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    // Make the API call using axios to the verify endpoint shown in Postman
    const response = await axios.post(
      `${baseURL}/user/search/verify`,
      { reference },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Payment verification response:", data);

    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// DELETE ACCOUNT
export const DeleteAccountRequest = async () => {
  try {
    // Get authentication token from session storage
    let authToken = null;

    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      console.log("Found token in session storage:", tokenStr);
      authToken = tokenStr;
    }

    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.accessToken) {
            authToken = auth.accessToken;
          } else if (auth.data && auth.data.token) {
            authToken = auth.data.token;
          } else if (auth.token) {
            authToken = auth.token;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    console.log("Deleting account...");

    // Make the API call using axios
    const response = await axios.post(
      `${baseURL}/delete/account`,
      {}, // Empty payload as per Postman screenshot
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    const data = response.data;
    console.log("Delete account response:", data);

    // Clear session storage after successful account deletion
    sessionStorage.clear();

    return data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

// GET USER DASHBOARD SUMMARY
export const GetUserDashboardSummary = async () => {
  try {
    console.log("Fetching user dashboard summary...");
    const baseURL = process.env.NEXT_PUBLIC_URL || "";

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token
      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return {
        success: false,
        error: "Authentication token not found",
        data: null,
      };
    }

    // Use the user dashboard endpoint
    const endpoint = "/user/search/total";

    console.log(`Making API request to: ${baseURL}${endpoint}`);
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("User dashboard summary API Response:", response.data);

    // Process the response data
    let summaryData = null;

    if (response.data && response.data.data) {
      summaryData = response.data.data;
    } else if (response.data && typeof response.data === "object") {
      // If the data is directly in the response
      summaryData = response.data;
    }

    // If the API doesn't return search counts, try to get them from search history
    if (!summaryData?.total_searches && !summaryData?.searches_count) {
      try {
        // Try to get search count from search history
        const searchHistoryResponse = await axios.get(
          `${baseURL}/user/search/history`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Search history for count:", searchHistoryResponse.data);

        // Count the search history items
        let searchCount = 0;
        if (
          searchHistoryResponse.data &&
          searchHistoryResponse.data.data &&
          Array.isArray(searchHistoryResponse.data.data)
        ) {
          searchCount = searchHistoryResponse.data.data.length;
        } else if (Array.isArray(searchHistoryResponse.data)) {
          searchCount = searchHistoryResponse.data.length;
        }

        // Add the search count to the summary data
        if (!summaryData) {
          summaryData = {};
        }
        summaryData.total_searches = searchCount;
      } catch (error) {
        console.error("Error fetching search history for count:", error);
      }
    }

    return { success: true, data: summaryData };
  } catch (error) {
    console.error("Error in GetUserDashboardSummary:", error);
    return {
      success: false,
      error:
        (error as Error).message || "Failed to fetch user dashboard summary",
      data: null,
    };
  }
};

// GET DASHBOARD SUMMARY (for court staff/admin)
export const GetDashboardSummary = async () => {
  try {
    console.log("Fetching dashboard summary...");
    const baseURL = process.env.NEXT_PUBLIC_URL || "";

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }

      // For testing purposes, use a mock token if no token is found
      if (!authToken) {
        console.warn("No auth token found, using mock token for development");
        authToken = "mock_token_for_development";
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return {
        success: false,
        error: "Authentication token not found",
        data: null,
      };
    }

    // Use the correct endpoint based on the API pattern
    const endpoint = "/court-staff/summary";

    console.log(`Making API request to: ${baseURL}${endpoint}`);
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Dashboard summary API Response:", response.data);

    // Process the response data
    let summaryData = null;

    if (response.data && response.data.data) {
      summaryData = response.data.data;
    } else if (response.data && typeof response.data === "object") {
      // If the data is directly in the response
      summaryData = response.data;
    }

    return { success: true, data: summaryData };
  } catch (error) {
    console.error("Error in GetDashboardSummary:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to fetch dashboard summary",
      data: null,
    };
  }
};

// GET SUPER ADMIN ACTIVITY LOGS
export const GetSuperAdminActivityLogs = async () => {
  try {
    console.log("Fetching super admin activity logs...");

    // Get auth token for authenticated requests
    let authToken = null;
    const tokenStr = sessionStorage.getItem("token");
    const authStr = sessionStorage.getItem("auth");

    if (tokenStr) {
      authToken = tokenStr;
    } else if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.token) {
          authToken = auth.token;
        } else if (auth.data && auth.data.token) {
          authToken = auth.data.token;
        } else if (auth.accessToken) {
          authToken = auth.accessToken;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    // Make API request to get activity logs
    const response = await axios.get(`${baseURL}/admin/activity/logs`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    console.log("Super admin activity logs response:", response.data);

    // Format the response data to match the expected format in the UI
    const logs = response.data.data || [];

    // Transform the API response to match the expected format in the UI
    const formattedLogs = logs.map((log: any) => ({
      id: log.id || String(Math.random()),
      user: {
        name: log.user_name || log.username || "Unknown User",
        email: log.user_email || log.email || "",
        avatar: log.avatar || "/placeholder.svg?height=40&width=40",
        initial: log.user_name ? log.user_name.charAt(0).toUpperCase() : "U",
      },
      type: log.action_type || "updated",
      description: log.description || log.action || "",
      timestamp: log.created_at || new Date().toISOString(),
      date: formatDate(log.created_at) || "Unknown Date",
      time: formatTime(log.created_at) || "Unknown Time",
      caseTitle: log.case_title || log.title || "",
      caseId: log.case_id || "",
      details: log.details
        ? {
            propertyTitle:
              log.details.property_title || log.details.title || "",
            registeredTitleNumber:
              log.details.registered_title_number ||
              log.details.title_number ||
              "",
            location: log.details.location || "",
            surveyPlanNumber: log.details.survey_plan_number || "",
            ownerName: log.details.owner_name || "",
            caseStatus: log.details.case_status || "Pending",
            lastUpdated:
              formatDate(log.details.updated_at || log.updated_at) ||
              "Unknown Date",
          }
        : undefined,
    }));

    console.log("Formatted super admin activity logs:", formattedLogs);
    return {
      success: true,
      data: formattedLogs,
    };
  } catch (error) {
    console.error("Error in GetSuperAdminActivityLogs:", error);
    return {
      success: false,
      data: [],
      error: (error as Error).message || "Failed to fetch activity logs",
    };
  }
};

// Helper functions for date formatting
function formatDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

function formatTime(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return dateString;
  }
}

// GET COURT REGISTRAR ACTIVITY LOGS
export const GetCourtRegistrarActivityLogs = async () => {
  try {
    console.log("Fetching court registrar activity logs...");
    const baseURL = process.env.NEXT_PUBLIC_URL || "";

    // Get authentication token from session storage
    let authToken = "";

    if (typeof window !== "undefined") {
      // Try multiple possible storage locations for the token

      // First try direct token storage
      const directToken = sessionStorage.getItem("token");
      if (directToken) {
        console.log("Found token in direct storage");
        authToken = directToken;
      }

      // If not found, try the auth object
      if (!authToken) {
        const authData = sessionStorage.getItem("auth");
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            if (parsedData.token) {
              authToken = parsedData.token;
            } else if (parsedData.accessToken) {
              authToken = parsedData.accessToken;
            } else if (parsedData.data && parsedData.data.token) {
              authToken = parsedData.data.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }

      // For testing purposes, use a mock token if no token is found
      if (!authToken) {
        console.warn("No auth token found, using mock token for development");
        authToken = "mock_token_for_development";
      }
    }

    if (!authToken) {
      console.error("Authentication token not found");
      return {
        success: false,
        error: "Authentication token not found",
        data: [],
      };
    }

    // Use the correct endpoint
    const endpoint = "/court-staff/activity/logs";

    console.log(`Making API request to: ${baseURL}${endpoint}`);
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);

    // Process the response data to ensure it matches our expected format
    let logsData = [];

    if (response.data && Array.isArray(response.data)) {
      logsData = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      logsData = response.data.data;
    } else if (response.data && typeof response.data === "object") {
      // If it's a single log object, wrap it in an array
      logsData = [response.data];
    }

    // Map the API response to our expected format
    const formattedLogs = logsData.map((log: any) => ({
      id: log.id || String(Math.random()),
      user: {
        name: log.user?.name || log.user_name || "Unknown User",
        email: log.user?.email || log.user_email || "",
        avatar: log.user?.avatar || "/placeholder.svg?height=40&width=40",
        initial: log.user?.initial || log.user_name?.charAt(0) || "U",
      },
      type: (log.type || "updated").toLowerCase(),
      description: log.description || "",
      timestamp: log.timestamp || log.created_at || new Date().toISOString(),
      date: log.date || new Date().toLocaleDateString(),
      time: log.time || new Date().toLocaleTimeString(),
      caseTitle: log.case_title || log.caseTitle || "",
      caseId: log.case_id || log.caseId || "",
      details: log.details || {
        propertyTitle: log.property_title || "",
        registeredTitleNumber: log.registered_title_number || "",
        location: log.location || "",
        surveyPlanNumber: log.survey_plan_number || "",
        ownerName: log.owner_name || "",
        caseStatus: log.case_status || "Pending",
        lastUpdated: log.last_updated || log.updated_at || "",
      },
    }));

    console.log("Formatted activity logs data:", formattedLogs);
    return { success: true, data: formattedLogs };
  } catch (error) {
    console.error("Error in GetCourtRegistrarActivityLogs:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to fetch activity logs",
      data: [],
    };
  }
};
