// utils/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || '';
export interface UpdatePaymentPayload {
  user_id: string;
  payment_amount: string | number;
  payment_session_id: string;
  pendens_id: string;
}

export async function updatePayment(payload: UpdatePaymentPayload): Promise<any> {
  console.log('updatePayment payload:', payload);
  
  // Use the actual pendens_id from the payload
  console.log('Using pendens_id from payload:', payload.pendens_id);
  
  // Create FormData exactly like in Postman
  const formData = new FormData();
  formData.append('user_id', payload.user_id);
  formData.append('payment_amount', String(payload.payment_amount));
  formData.append('payment_session_id', payload.payment_session_id);
  formData.append('pendens_id', payload.pendens_id);
  
  // Log the form data entries for debugging
  console.log('Form data entries:');
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  // Use the local API proxy configured in next.config.js
  // This avoids CORS issues by proxying requests through your Next.js server
  const apiUrl = '/api/payment-update'; // This will be proxied to http://147.182.229.165/api/payment-update
  
  console.log('Making POST request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      authToken = authObj.accessToken || authObj.token;
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  // Make the request with authentication headers and form-data payload (like Postman)
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      // Don't set Content-Type when using FormData - browser will set it with boundary
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      // Add Authorization header if token is available
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
    },
    body: formData, // Send as FormData
    // Ensure credentials are included if needed
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Payment update failed: ${response.statusText}`);
  }
  
  // Get the response data
  const responseData = await response.json();
  console.log('Payment update API response:', responseData);
  
  // Check if the response contains a payment_id
  if (responseData && responseData.payment_id) {
    console.log('Payment ID from backend:', responseData.payment_id);
    
    // Get the existing payment info
    const paymentInfoStr = sessionStorage.getItem("paymentInfo");
    if (paymentInfoStr) {
      const paymentInfo = JSON.parse(paymentInfoStr);
      
      // Update the payment info with the payment_id from the backend
      const updatedPaymentInfo = {
        ...paymentInfo,
        payment_id: responseData.payment_id // Save the payment_id from the backend
      };
      
      // Store the updated payment info
      sessionStorage.setItem("paymentInfo", JSON.stringify(updatedPaymentInfo));
      console.log('Updated payment info with backend payment_id:', updatedPaymentInfo);
    }
  }
  
  return responseData;
}

export interface UpdateDownloadPayload {
  search_id: string | number;
}

export async function updateDownload(payload: UpdateDownloadPayload): Promise<any> {
  console.log('updateDownload payload:', payload);
  
  // Create FormData exactly like in Postman
  const formData = new FormData();
  formData.append('search_id', String(payload.search_id));
  
  // Log the form data entries for debugging
  console.log('Form data entries:');
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  // Use the local API proxy configured in next.config.js
  const apiUrl = '/api/update-download'; // This will be proxied to the real API
  
  console.log('Making POST request to:', apiUrl);
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      authToken = authObj.accessToken || authObj.token;
    }
    
    // If not found, try other common storage keys
    if (!authToken) {
      authToken = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    }
    
    console.log('Using auth token:', authToken ? 'Found token' : 'No token found');
  } catch (e) {
    console.error('Error retrieving auth token:', e);
  }
  
  // Make the request with authentication headers and form-data payload
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      // Don't set Content-Type when using FormData - browser will set it with boundary
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      // Add Authorization header if token is available
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
    },
    body: formData, // Send as FormData
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Update download failed: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  console.log('Update download API response:', responseData);
  return responseData;
}

// Interface for user details
export interface UserDetails {
  user_type?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  [key: string]: any; // For any additional fields
}

// Get user details from the API
export async function getUserDetails(): Promise<UserDetails> {
  console.log('Fetching user details');
  
  // Use the local API proxy configured in next.config.js
  const apiUrl = '/api/update-details'; // This will be proxied to the real API
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      authToken = authObj.accessToken || authObj.token;
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
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user details: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  console.log('User details API response:', responseData);
  return responseData.data || responseData;
}

// Update user details
export async function updateUserDetails(details: UserDetails): Promise<any> {
  console.log('Updating user details:', details);
  
  // Create FormData exactly like in Postman
  const formData = new FormData();
  
  // Add all user details to the form data
  Object.entries(details).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  // Log the form data entries for debugging
  console.log('Form data entries:');
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  // Use the local API proxy configured in next.config.js
  const apiUrl = '/api/update-details'; // This will be proxied to the real API
  
  // Get authentication token from sessionStorage
  let authToken = null;
  try {
    // Try to get token from auth object
    const authStr = sessionStorage.getItem('auth');
    if (authStr) {
      const authObj = JSON.parse(authStr);
      authToken = authObj.accessToken || authObj.token;
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
  
  // Make the POST request with authentication headers and form-data payload
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to update user details: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  console.log('Update user details API response:', responseData);
  return responseData;
}
