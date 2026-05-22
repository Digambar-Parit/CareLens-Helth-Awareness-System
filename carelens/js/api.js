const API_URL = 'http://localhost:5000/api';

const api = {
  async post(endpoint, data, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data)
    });
    return response.json();
  },

  async get(endpoint) {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    return response.json();
  },

  async delete(endpoint) {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    return response.json();
  }
};
