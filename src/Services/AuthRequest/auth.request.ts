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

// interface signupType {
//   individual: string;
//   company: string;
// }

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


interface VerifyTokenRequestParams {
  token: string
  type: "REGISTER" | "PASSWORD_RESET"
}

// Interface for resend verification code request
interface ResendVerificationCodeParams {
  email: string
  type: "REGISTER" | "PASSWORD_RESET"
}

// Base URL for API
const baseURL = process.env.NEXT_PUBLIC_URL;
console.log(baseURL, "Base URL is here");

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
    console.error('Company signup error:', error);
    throw error;
  }
};

// Get the appropriate redirect path based on user type
export const getUserRedirectPath = (userType: string): string => {
  console.log('Getting redirect path for user type:', userType);
  
  // Convert to lowercase for case-insensitive comparison
  const type = userType.toLowerCase();
  
  if (type === 'admin') {
    return '/Super-admin';
  } else if (type === 'registrar' || type === 'court_staff') {
    return '/court-registrar';
  } else if (type === 'company' || type === 'user_company') {
    return '/users';
  } else if (type === 'individual' || type === 'user_individual') {
    return '/users';
  } else {
    // Default path for any other user type
    console.log('Unknown user type, defaulting to /users');
    return '/users';
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
    const responseData = response.data;
    console.log(responseData, "====== Login response data ======");
    
    if (!responseData) return undefined;
    
    // Extract user type for redirection
    let userType = '';
    if (responseData.data && responseData.data.type) {
      // Based on the Postman example, the type is in data.type
      userType = responseData.data.type;
      console.log('Found user type in data.type:', userType);
    } else if (responseData.data && responseData.data.user_type) {
      userType = responseData.data.user_type;
      console.log('Found user type in data.user_type:', userType);
    } else if (responseData.user_type) {
      userType = responseData.user_type;
      console.log('Found user type in user_type:', userType);
    } else if (responseData.role) {
      userType = responseData.role;
      console.log('Found user type in role:', userType);
    } else if (responseData.type) {
      userType = responseData.type;
      console.log('Found user type in type:', userType);
    }
    
    console.log('Extracted user type for redirection:', userType);
    
    // Based on the Postman response, the token is inside the data object
    // Structure: { success: true, message: string, data: { id, name, email, ..., token } }
    let token = null;
    if (responseData.data && responseData.data.token) {
      token = responseData.data.token;
      console.log('Found token in response data.data.token:', token);
    } else if (responseData.token) {
      token = responseData.token;
      console.log('Found token in response data.token:', token);
    }
    
    if (token) {
      // Save the auth token in multiple formats for compatibility
      // 1. Save the entire response
      sessionStorage.setItem('auth', JSON.stringify(responseData));
      
      // 2. Save just the token
      sessionStorage.setItem('token', token);
      
      // 3. Save the user data
      if (responseData.data) {
        sessionStorage.setItem('user', JSON.stringify(responseData.data));
      }
      
      // 4. Save in a format that UpdateProfileRequest expects
      const authData = {
        token: token,
        data: responseData.data || responseData
      };
      sessionStorage.setItem('authData', JSON.stringify(authData));
      
      console.log('Auth data saved to session storage');
      console.log('User should be redirected to:', getUserRedirectPath(userType));
    } else {
      console.error('User data not found in expected location. Response structure:', responseData);
    }
    
    return responseData;
  } catch (error) {
    console.error('Login error:', error);
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

// Verify token API request
export const VerifyTokenRequest = async (params: VerifyTokenRequestParams) => {
  try {
    // Replace with your actual API endpoint and implementation
    const response = await fetch(`${baseURL}/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw { response: { data: errorData } }
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

// Resend verification code API request
export const ResendVerificationCodeRequest = async (params: ResendVerificationCodeParams) => {
  try {
    // Replace with your actual API endpoint and implementation
    const response = await fetch(`${baseURL}/auth/resend-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw { response: { data: errorData } }
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

// UPDATE PROFILE REQUEST
export const UpdateProfileRequest = async (params: UpdateProfileParams) => {
  try {
    console.log('Updating profile with params:', params);
    
    // Create form data from params
    const formData = new FormData();
    
    // Add each parameter to form data if it exists
    if (params.password) formData.append('password', params.password);
    if (params.password_confirmation) formData.append('password_confirmation', params.password_confirmation);
    if (params.name) formData.append('name', params.name);
    if (params.dob) formData.append('dob', params.dob);
    
    // Get authentication token from session storage - based on the structure from login response
    let authToken = null;
    
    // Try getting the token directly from the token storage
    const tokenStr = sessionStorage.getItem('token');
    if (tokenStr) {
      console.log('Found token in session storage:', tokenStr);
      authToken = tokenStr;
    }
    
    // If that fails, try getting it from the auth object
    if (!authToken) {
      const authStr = sessionStorage.getItem('auth');
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);
          console.log('Auth data from session storage:', auth);
          
          // Based on the Postman response structure
          if (auth.data && auth.data.token) {
            authToken = auth.data.token;
            console.log('Found token in auth.data:', authToken);
          } else if (auth.token) {
            authToken = auth.token;
            console.log('Found token at auth.token:', authToken);
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
    }
    
    // If still no token, try the authData object
    if (!authToken) {
      const authDataStr = sessionStorage.getItem('authData');
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          if (authData.token) {
            authToken = authData.token;
            console.log('Found token in authData:', authToken);
          }
        } catch (error) {
          console.error('Error parsing authData:', error);
        }
      }
    }
    
    // Last resort: check if user object has token
    if (!authToken) {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData.token) {
            authToken = userData.token;
            console.log('Found token in user data:', authToken);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    
    if (!authToken) {
      console.error('Authentication token not found in any storage location');
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    // Make the API call
    const response = await fetch(`${baseURL}/profile/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    
    const data = await response.json();
    console.log('Profile update response:', data);
    
    // Update the session storage with the updated user data
    if (data && data.success) {
      try {
        // Update user data in session storage
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          
          // Update the user data with the new values from params
          if (params.name) userData.name = params.name;
          if (params.dob) userData.date_of_birth = params.dob;
          
          // Save the updated user data back to session storage
          sessionStorage.setItem('user', JSON.stringify(userData));
          console.log('Updated user data in session storage:', userData);
        }
        
        // Also update the auth object if it exists
        const authStr = sessionStorage.getItem('auth');
        if (authStr) {
          const auth = JSON.parse(authStr);
          
          if (auth.data) {
            // Update the auth data with the new values
            if (params.name) auth.data.name = params.name;
            if (params.dob) auth.data.date_of_birth = params.dob;
            
            // Save the updated auth data back to session storage
            sessionStorage.setItem('auth', JSON.stringify(auth));
            console.log('Updated auth data in session storage:', auth);
          }
        }
      } catch (error) {
        console.error('Error updating session storage after profile update:', error);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
