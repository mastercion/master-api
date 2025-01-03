import React, { useState, useEffect } from 'react';
import AddPurchaseModal from './AddPurchaseModal';

function PurchaseHistory() {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchItems();
    fetchHistory();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.178.20:5000/users');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://192.168.178.20:5000/items');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://192.168.178.20:5000/purchase-history');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched history data:', data);
      
      // Check if the data array exists and has at least one element
      if (Array.isArray(data) && data.length > 0) {
        // Use optional chaining to access the name property
        data.forEach((record) => {
          console.log(record.item?.name);
          console.log(record.user?.name);
        });
      } else {
        console.log('No history data available');
      }
      
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };
  

  const handleDelete = async (userId, historyId) => {
    try {
      const response = await fetch(`http://192.168.178.20:5000/purchase-history/${userId}/${historyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
      
      // Refresh the history after deletion
      fetchHistory();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };
  

  const handleAddPurchase = async (purchase) => {
    try {
      const response = await fetch('http://192.168.178.20:5000/when-bought', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchase),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Log specific server response
        throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Purchase added:', data.message);
      fetchHistory(); // Refresh history after adding a purchase
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };
  console.log('History data structure:', history);
  
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>

      <h2>Tabak Kauf verlauf</h2>
      <button onClick={openModal}>+ Kauf hinzufügen</button>
      <div className="history-list">
  {history
    .sort((a, b) => new Date(b.boughtAt) - new Date(a.boughtAt))
    .map((record, index) => (
      <div key={index} className="history-card">
        <div className="history-content">
          <img 
            src={record.item.image_url} 
            alt={record.item.name} 
            className="item-image"
          />
          <div className="item-details">
            <h3>{record.item.name}</h3>
            <p>Tabak: {record.item.brand}</p>
            <p>Gekauft von: {record.user.name}</p>
            <p>Am: {new Date(record.boughtAt).toLocaleString()}</p>
          </div>
          <button 
            className="delete-btn"
            onClick={() => handleDelete(record.user._id, record._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
      </div>

      <AddPurchaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddPurchase={handleAddPurchase}
        users={users}
        items={items} // Pass items to modal for use in dropdowns
      />
    </div>
  );
}

export default PurchaseHistory;
