import React, { useEffect, useState, useContext } from 'react';
import './List.css';
import axios from 'axios';
import { AdminContext } from '../../components/Context/adminContext';

const List = ({ url }) => {
  const { adminToken } = useContext(AdminContext);
  const [items, setItems] = useState([]);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, {
        headers: { token: adminToken }
      });
      setItems(response.data.data); // ✅ Use 'data' as returned by backend
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className='list'>
      <h2 className='list-title'>Your Food Items</h2>

      {items.length === 0 ? (
        <p style={{ padding: '1rem', fontSize: '1.1rem' }}>No food items added yet.</p>
      ) : (
        <>
          <div className="list-table-format title">
            <b>Image</b><b>Name</b><b>Description</b><b>Category</b><b>Price</b>
          </div>
          {items.map(item => (
            <div className="list-table-format" key={item._id}>
              <img src={`${url}/images/${item.image}`} alt="food" />
              <p>{item.name}</p>
              <p>{item.description}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default List;
