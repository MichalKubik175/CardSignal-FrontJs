import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: baseURL,
});

const token = localStorage.getItem('authToken');

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

);

const CreateCardLink = () => {
console.log(baseURL + '/api/card-links');
  const [formData, setFormData] = useState({
    name: '',
    expirationDate: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const domain = window.location.origin;
    const link = `${domain}/verify/`;

    let expirationDate = formData.expirationDate
      ? new Date(formData.expirationDate).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    const payload = {
      name: formData.name,
      link,
      expirationDate,
    };

    try {
      await api.post('/api/card-links', payload);
      setMessage('Card created successfully!');
      setFormData({ name: '', expirationDate: '' });
    } catch (error) {
      console.error(error);
      setMessage('Error creating card.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Card</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Expiration Date (optional)</label>
          <input
            name="expirationDate"
            type="datetime-local"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default CreateCardLink;
