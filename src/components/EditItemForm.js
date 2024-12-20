import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
        const response = await axios.get(`http://localhost:5000/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Error fetching item');
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/items/${id}`, item);
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