import React, { useState } from "react";
import axios from "axios";
import dotenv from 'react-dotenv';

const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY_BAD;

const AddUser = () => {
  const [Username, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const Username = formData.get("Username");
  
    console.log("Username:", Username);
  
    // Ensure values are not undefined
    if (!Username) {
      console.error("All fields are required!");
      return;
    }
  
    // Create a user object
    const user = { Username };
  
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_IP}:5000/User`, user, {
        headers: {
          "Content-Type": "application/json", // Make sure this header is set correctly
          'X-API-KEY': process.env.REACT_APP_API_KEY
        },
      });
      console.log("User added:", response.data);
    } catch (error) {
      console.error("Error adding user:", error.response ? error.response.data : error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="Username"        // name="name" should match e.target.name.value
        placeholder="Username"
      />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUser;
