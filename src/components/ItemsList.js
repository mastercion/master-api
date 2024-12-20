import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all items from the backend
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        setItems(response.data);
      } catch (err) {
        setError('Error fetching items');
      }
    };

    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setItems(items.filter(item => item._id !== id));  // Update the UI after deletion
    } catch (err) {
      setError('Error deleting item');
    }
  };

  const editItem = (id) => {
    // Redirect or open a form for editing the item (create an EditItemForm component if needed)
    navigate(`/edit-item/${id}`);
  };

  return (
    <div>
  <h2>Item List</h2>
  {error && <p>{error}</p>}
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {items.map(item => (
      <li key={item._id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img 
          src={item.image_url} 
          alt={item.name}
          style={{ 
            width: '100px', 
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
        <div>
          <strong>{item.name}</strong><br />
          Brand: {item.brand}<br />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => editItem(item._id)}>Edit</button>
            <button onClick={() => deleteItem(item._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
  );
};

export default ItemsList;
