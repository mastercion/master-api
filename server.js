const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/energy-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: { type: String, required: true },
  brand: { type: String, required: true },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;

// Routes
// Create an entry
app.post('/items', async (req, res) => {
    const { name, image_url, brand } = req.body;
    
    console.log('Received data:', req.body);  // This should log the data as you expect.
  
    // Check if all fields are present
    if (!name || !image_url || !brand) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
  
    try {
      const newItem = new Item({ name, image_url, brand });
      await newItem.save();
      res.status(201).json(newItem);  // Respond with the saved item
    } catch (err) {
      console.error('Error saving item:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
// Update an existing item
app.put('/items/:id', async (req, res) => {
    const { name, image_url, brand } = req.body;
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        { name, image_url, brand },
        { new: true }  // Return the updated document
      );
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ message: 'Error updating item' });
    }
  });

// Delete an item
app.delete('/items/:id', async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting item' });
    }
  });

// Get items by brand
app.get("/items/brand/:brand", async (req, res) => {
  try {
    const { brand } = req.params;
    const items = await Item.find({ brand });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/items', async (req, res) => {
    try {
      // Retrieve all items from the database
      const items = await Item.find(); // This uses Mongoose to get all items
  
      // Send the items as a JSON response
      res.status(200).json(items);
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // Get a specific item
app.get('/items/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching item' });
    }
  });
  



// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
