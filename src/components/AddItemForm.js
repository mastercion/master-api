import React, { useState } from "react";
import axios from "axios";
import dotenv from 'react-dotenv';

const api_key = process.env.REACT_APP_API_KEY;

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [brand, setBrand] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const imageUrl = formData.get("imageUrl");
    const brand = formData.get("brand");

    console.log("Name:", name);
    console.log("Image URL:", imageUrl);
    console.log("Brand:", brand);

    
  
    // Ensure values are not undefined
    if (!name || !imageUrl || !brand) {
      console.error("All fields are required!");
      return;
    }
  
    // Create item object
    const item = {
        name,
        image_url: imageUrl,  // Change imageUrl to image_url to match the Mongoose schema
        brand,
      };
  
      try {
        const config = {
          headers: {
            'X-API-KEY': api_key,
            'Content-Type': 'application/json',
          },
        };
    
        const response = await axios.post(`http://${process.env.REACT_APP_IP}:5000/items`, item, config);
        console.log("Item added:", response.data);
      } catch (error) {
        console.error("Error adding item:", error.response ? error.response.data : error);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"        // name="name" should match e.target.name.value
        placeholder="Item Name"
      />
      <input
        type="text"
        name="imageUrl"    // name="imageUrl" should match e.target.imageUrl.value
        placeholder="Image URL"
      />
      <input
        type="text"
        name="brand"       // name="brand" should match e.target.brand.value
        placeholder="Brand"
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
