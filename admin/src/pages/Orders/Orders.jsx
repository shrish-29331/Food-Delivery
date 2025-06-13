import React, { useEffect, useState, useContext } from 'react';
import './Orders.css';
import axios from 'axios';
import { AdminContext } from '../../components/Context/adminContext';

const Orders = ({ url }) => {
  const { adminToken } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token: adminToken }
      });

      // ✅ Backend already filters by adminId, just use response.data.data
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='orders'>
      <h2 className='list-title'>Your Orders</h2>

      {orders.length === 0 ? (
        <p style={{ padding: '1rem', fontSize: '1.1rem' }}>No orders placed for your food items yet.</p>
      ) : (
        orders.map((order, index) => (
          <div className="order-item" key={order._id}>
            <p>Order #{index + 1}</p>
            <div>
              {order.items.map((item, idx) => (
                <div key={idx}>
                  <p className='order-item-food'>{item.name} × {item.quantity}</p>
                </div>
              ))}
            </div>
            <p className='order-item-name'>{order.address.name}</p>
            <p className='order-item-address'>
              {order.address.street}, {order.address.city}
            </p>
            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
