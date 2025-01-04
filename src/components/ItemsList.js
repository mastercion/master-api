import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dotenv from 'react-dotenv';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://${process.env.REACT_APP_IP}:5000/items`, {
          headers: {
            'X-API-KEY': process.env.REACT_APP_API_KEY,
          },
        });
        setItems(response.data);
        setFilteredItems(response.data);
  
        // Extract unique brands for the filter
        const uniqueBrands = [...new Set(response.data.map(item => item.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        setError('Error fetching items');
      }
    };
  
    fetchItems();
  }, []);

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    if (brand === '') {
      setFilteredItems(items); // Show all items if no brand is selected
    } else {
      setFilteredItems(items.filter(item => item.brand === brand));
    }
  };

  const deleteItem = async (id) => {
    try {
      const config = {
        headers: {
          'X-API-KEY': process.env.REACT_APP_API_KEY,
        },
      };
      await axios.delete(`http://${process.env.REACT_APP_IP}:5000/items/${id}`, config);
      const updatedItems = items.filter(item => item._id !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems); // Update filtered items as well
    } catch (err) {
      setError('Error deleting item');
    }
  };

  const editItem = (id) => {
    navigate(`/edit-item/${id}`);
  };

  return (
    <div>
      <h2>Item List</h2>
      {error && <p>{error}</p>}

      {/* Brand filter dropdown */}
      <label htmlFor="brandFilter">Filter by Brand: </label>
      <select
        id="brandFilter"
        value={selectedBrand}
        onChange={(e) => handleBrandFilter(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredItems.map(item => (
          <li
            key={item._id}
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <img
              src={item.image_url}
              alt={item.name}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <div>
              <strong>{item.name}</strong>
              <br />
              Brand: {item.brand}
              <br />
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => editItem(item._id)}>Edit</button>
                <button
                  onClick={() => deleteItem(item._id)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
