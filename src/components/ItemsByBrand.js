import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemsByBrand = () => {
  const [brand, setBrand] = useState("");
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/items/brand/${brand}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    if (brand) fetchItems();
  }, [brand]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <img src={item.image_url} alt={item.name} style={{ width: "100px" }} />
            <p>{item.brand}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsByBrand;
