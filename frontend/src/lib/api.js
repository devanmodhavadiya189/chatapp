const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chatty-pv9k.onrender.com';
const API_BASE = `${API_BASE_URL}/api`;

class ApiClient {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // File upload method
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE}/message/upload`;
    const config = {
      method: 'POST',
      credentials: 'include',
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(fullname, email, password) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullname, email, password }),
    });
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  async checkAuth() {
    return this.makeRequest('/auth/check');
  }

  async updateProfile(updateData) {
    return this.makeRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Users
  async getUsers() {
    return this.makeRequest('/message/users');
  }

  // Messages
  async getMessages(userId) {
    return this.makeRequest(`/message/${userId}`);
  }

  async sendMessage(receiverId, text, file = null) {
    return this.makeRequest(`/message/send/${receiverId}`, {
      method: 'POST',
      body: JSON.stringify({ text, file }),
    });
  }

  async markMessagesSeen(senderId) {
    return this.makeRequest(`/message/seen/${senderId}`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();