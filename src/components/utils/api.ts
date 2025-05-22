// utils/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || '';
const API_URL = process.env.NEXT_PUBLIC_URL || '';

export interface CaseData {
  tile?: string;
  title_number?: string;
  survey_plan_number?: string;
  owner_name?: string;
  address?: string;
  parties?: string;
  name_of_parties?: string;
  suit_number?: string;
  court_details?: string;
  date_of_commencement?: string;
  date_of_disposal?: string;
  nature_of_case?: string;
  status?: string;
  state_id?: string;
  state?: string;
  lga_id?: string;
  lga?: string;
  judicial_division_id?: string;
  judicial_division?: string;
  description_of_properties?: string;
  subject_matter?: string;
}

// Create a new case (for super-admin)
export async function createCase(caseData: CaseData): Promise<any> {
  console.log('Creating new case with data:', caseData);
  
  // Create FormData for the API request
  const formData = new FormData();
  
  // Add all case data to the form data
  Object.entries(caseData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  // Log the form data entries for debugging
  console.log('Form data entries:');
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  // Use the admin cases endpoint
  const apiUrl = `${API_URL}/admin/cases`;
  
  console.log('Making POST request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      if (authObj.token) {
        authToken = authObj.token;
      } else if (authObj.data && authObj.data.token) {
        authToken = authObj.data.token;
      } else if (authObj.accessToken) {
        authToken = authObj.accessToken;
      }
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  if (!authToken) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  // Make the request with authentication headers and JSON payload
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      // Don't set Content-Type for FormData
    },
    body: formData,
    // Remove credentials: 'include' to avoid CORS issues
    credentials: 'same-origin'
  });

  if (!response.ok) {
    let errorMessage = `Case creation failed: ${response.statusText}`;
    
    try {
      // Try to parse the error response as JSON
      const errorData = await response.json();
      console.error('Error response:', errorData);
      
      // Extract error message from common API response formats
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
      }
    } catch (e) {
      // If it's not JSON, get the text response
      const errorText = await response.text();
      console.error('Error response (text):', errorText);
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  const responseData = await response.json();
  console.log('Case creation API response:', responseData);
  return responseData;
}

// Update an existing case (for super-admin)
export async function updateCase(caseId: string, caseData: CaseData): Promise<any> {
  console.log('Updating case with ID:', caseId, 'and data:', caseData);
  
  // Create FormData for the API request
  const formData = new FormData();
  
  // Add all case data to the form data
  Object.entries(caseData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  // Log the form data entries for debugging
  console.log('Form data entries:');
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  // Use the admin cases update endpoint
  const apiUrl = `${API_URL}/admin/cases/${caseId}/update`;
  
  console.log('Making POST request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      if (authObj.token) {
        authToken = authObj.token;
      } else if (authObj.data && authObj.data.token) {
        authToken = authObj.data.token;
      } else if (authObj.accessToken) {
        authToken = authObj.accessToken;
      }
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  if (!authToken) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  // Make the request with authentication headers and FormData payload
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      // Don't set Content-Type for FormData
    },
    body: formData,
    // Use same-origin instead of include to avoid CORS issues
    credentials: 'same-origin'
  });

  if (!response.ok) {
    let errorMessage = `Case update failed: ${response.statusText}`;
    
    try {
      // Try to parse the error response as JSON
      const errorData = await response.json();
      console.error('Error response:', errorData);
      
      // Extract error message from common API response formats
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
      }
    } catch (e) {
      // If it's not JSON, get the text response
      const errorText = await response.text();
      console.error('Error response (text):', errorText);
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  const responseData = await response.json();
  console.log('Case update API response:', responseData);
  return responseData;
}

// Get all cases (for super-admin)
// Delete a case (for super-admin)
export async function deleteCase(caseId: string): Promise<any> {
  console.log('Deleting case with ID:', caseId);
  
  // Use the admin cases delete endpoint
  const apiUrl = `${API_URL}/admin/cases/${caseId}`;
  
  console.log('Making DELETE request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      if (authObj.token) {
        authToken = authObj.token;
      } else if (authObj.data && authObj.data.token) {
        authToken = authObj.data.token;
      } else if (authObj.accessToken) {
        authToken = authObj.accessToken;
      }
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  if (!authToken) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  // Make the request with authentication headers
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    // Use same-origin instead of include to avoid CORS issues
    credentials: 'same-origin'
  });

  if (!response.ok) {
    let errorMessage = `Case deletion failed: ${response.statusText}`;
    
    try {
      // Try to parse the error response as JSON
      const errorData = await response.json();
      console.error('Error response:', errorData);
      
      // Extract error message from common API response formats
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
      }
    } catch (e) {
      // If it's not JSON, get the text response
      const errorText = await response.text();
      console.error('Error response (text):', errorText);
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  // Check if there's a response body
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const responseData = await response.json();
    console.log('Case deletion API response:', responseData);
    return responseData;
  } else {
    console.log('Case deletion successful (no response body)');
    return { success: true };
  }
}

export interface UpdateDownloadParams {
  search_id: string;
}

export async function updateDownload(params: UpdateDownloadParams): Promise<any> {
  console.log('Updating download count for search ID:', params.search_id);
  
  // Use the update-download endpoint
  const apiUrl = `${API_URL}/update-download`;
  
  console.log('Making POST request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      if (authObj.token) {
        authToken = authObj.token;
      } else if (authObj.data && authObj.data.token) {
        authToken = authObj.data.token;
      } else if (authObj.accessToken) {
        authToken = authObj.accessToken;
      }
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  if (!authToken) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  // Make the request with authentication headers and JSON payload
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(params),
    credentials: 'same-origin'
  });

  if (!response.ok) {
    let errorMessage = `Update download failed: ${response.statusText}`;
    
    try {
      // Try to parse the error response as JSON
      const errorData = await response.json();
      console.error('Error response:', errorData);
      
      // Extract error message from common API response formats
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((e: any) => e.message || e).join(', ');
      }
    } catch (e) {
      // If it's not JSON, get the text response
      const errorText = await response.text();
      console.error('Error response (text):', errorText);
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  // Check if there's a response body
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const responseData = await response.json();
    console.log('Update download API response:', responseData);
    return responseData;
  } else {
    console.log('Update download successful (no response body)');
    return { success: true };
  }
}

export async function getAllCases(): Promise<any> {
  console.log('Fetching all cases');
  
  // Use the admin cases endpoint
  const apiUrl = `${API_URL}/admin/cases`;
  
  console.log('Making GET request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      if (authObj.token) {
        authToken = authObj.token;
      } else if (authObj.data && authObj.data.token) {
        authToken = authObj.data.token;
      } else if (authObj.accessToken) {
        authToken = authObj.accessToken;
      }
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    if (!authToken) {
      throw new Error('Authentication token not found');
    }
  } catch (e) {
    console.error('Error retrieving auth token:', e);
    throw e;
  }
  
  // Make the GET request with authentication headers
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    // Use same-origin instead of include to avoid CORS issues
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  console.log('Get all cases API response:', responseData);
  return responseData.data || responseData;
}
