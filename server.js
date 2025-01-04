const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const apiKey = process.env.REACT_APP_API_KEY;

const app = express();

const config = require('./config.json');
const ipAddress = config.ipAddress;
const mongoAdress = config.mongoAdress;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: [`http://${ipAddress}:3000`, `http://192.168.178.20:3000`], // Adjust the port number if your frontend runs on a different port
  optionsSuccessStatus: 200
}));

// Connect to MongoDB
mongoose.connect(`mongodb://${mongoAdress}:27017/energy-tracker`, {
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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  history: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },  // Use 'item' consistently
    date: { type: Date, default: Date.now }
  }]
});


const User = mongoose.model('User', userSchema);
module.exports = User;

const validateApiKey = (req, res, next) => {
  const providedApiKey = req.header('X-API-KEY');
  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).json({ error: `Invalid API key ${providedApiKey}\n Expected API key ${apiKey}` });
  }
  next();
};

// Track a drink for a user
app.post('/users/:userId/track', async (req, res) => {
  const { userId } = req.params;
  const { drinkId } = req.body;

  if (!drinkId) {
    return res.status(400).json({ message: 'Drink ID is required' });
  }

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the drink to the user's history
    user.history.push({ drink: drinkId });
    await user.save();

    res.status(200).json({ message: 'Drink tracked successfully', user });
  } catch (error) {
    console.error('Error tracking drink:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get the tracking history of a user
app.get('/users/:userId/history', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and populate their drink history
    const user = await User.findById(userId).populate('history.drink');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.history);
  } catch (error) {
    console.error('Error fetching tracking history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = new User({ name, email, history: [] });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Routes
// Create an entry
// Create an entry
app.post('/items', validateApiKey, async (req, res) => {
  const { name, image_url, brand } = req.body;
  
  console.log('Received data:', req.body);  // This should log the data as you expect.
  
  // Log the expected and used API keys
  console.log(`Expected API key: ${apiKey}`);
  console.log(`Used API key: ${req.header('X-API-KEY')}`);
  
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

  app.post('/User', validateApiKey, async (req, res) => {
    const { Username } = req.body;
  
    console.log('Received data:', req.body);  // This should log the data as you expect.
  
    // Check if all fields are present
    if (!Username) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
  
    try {
      // Create a new User object
      const newUser = new User({ name: Username, history: [] });
      await newUser.save();
      res.status(201).json(newUser);  // Respond with the saved user
    } catch (err) {
      console.error('Error saving user:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // In your /users endpoint
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('history.item'); // Change from 'history.drink' to 'history.item'
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

  // In your /purchase-history endpoint
  app.get('/purchase-history', async (req, res) => {
    try {
      const users = await User.find().populate('history.item');
      
      // Transform the data
      const history = users.flatMap(user => 
        user.history.map(h => {
          if (h.item && user) {
            return {
              _id: h._id, 
              user: {
                _id: user._id,
                name: user.name
              },
              item: {
                name: h.item.name,
                image_url: h.item.image_url,
                brand: h.item.brand
              },
              boughtAt: h.date
            };
          } else {
            return null;
          }
        }).filter(Boolean) // Filter out null values
      );
    
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching purchase history', error: error.message });
    }
  });
  
  

app.delete('/purchase-history/:userId/:historyId', validateApiKey, async (req, res) => {
  const { userId, historyId } = req.params;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the specific history entry
    user.history = user.history.filter(h => h._id.toString() !== historyId);
    await user.save();
    
    res.json({ message: 'Purchase history entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase history entry', error: error.message });
  }
});

  app.post('/when-bought', validateApiKey, async (req, res) => {
    const { userId, itemId, boughtAt } = req.body;
  
    // Validate incoming request
    if (!userId || !itemId) {
      return res.status(400).json({ message: 'userId and itemId are required.' });
    }
  
    try {
      // Find the user and item
      const user = await User.findById(userId);
      const item = await Item.findById(itemId);
  
      if (!user || !item) {
        return res.status(404).json({ message: 'User or Item not found.' });
      }
  
      // Add the item to the user's purchase history with an optional boughtAt time
      user.history.push({
        item: item._id,
        boughtAt: boughtAt || new Date() // Use provided date or default to now
      });
  
      await user.save();
  
      res.status(200).json({ message: 'Purchase recorded successfully.', user });
    } catch (error) {
      console.error('Error recording purchase:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  
  
  
// Update an existing item
app.put('/items/:id', validateApiKey, async (req, res) => {
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

  app.get('/items/:id', validateApiKey, async (req, res) => {
    try {
      const id = req.params.id;
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Delete an item
app.delete('/items/:id', validateApiKey, async (req, res) => {
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
// Update an existing item
app.put('/items/:id', validateApiKey, async (req, res) => {
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
  



// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://${ipAddress}:${PORT}`));
