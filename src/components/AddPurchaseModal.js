import React, { useState } from 'react';

function AddPurchaseModal({ isOpen, onClose, onAddPurchase, users, items }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const handleAdd = () => {
    if (selectedUser && selectedItem && purchaseDate) {
      onAddPurchase({
        userId: selectedUser,
        itemId: selectedItem,
        boughtAt: purchaseDate
      });
      onClose(); 
    } else {
      alert('Please fill out all fields');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Purchase</h2>
        <div>
          <label>User:</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Item:</label>
          <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
            <option value="">Select an item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            value={purchaseDate} 
            onChange={e => setPurchaseDate(e.target.value)} 
          />
        </div>
        <button onClick={handleAdd}>Add Purchase</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddPurchaseModal;
