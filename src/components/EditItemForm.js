import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import dotenv from 'react-dotenv';

const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;
const REACT_APP_API_KEY_BAD = process.env.REACT_APP_API_KEY_BAD;

const EditItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: '',
    image_url: '',
    brand: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const config = {
          headers: {
            'X-API-KEY': process.env.REACT_APP_API_KEY,
          },
        };
        console.log('Fetching item with ID:', id);
        const response = await axios.get(`http://${process.env.REACT_APP_IP}:5000/items/${id}`, config);
        console.log('Response:', response);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Error fetching item');
      }
    };
  
    fetchItem();
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'X-API-KEY': REACT_APP_API_KEY,
        },
      };
  
      await axios.put(`http://${process.env.REACT_APP_IP}:5000/items/${id}`, item, config);
      navigate('/');  // Redirect to the list page after editing
    } catch (err) {
      setError('Error updating item');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Edit Item</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={item.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="image_url" value={item.image_url} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Brand:
          <input type="text" name="brand" value={item.brand} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditItemForm;