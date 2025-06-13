// src/pages/MerchantShop/MerchantShop.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MerchantShop.css';
import FoodItem from '../../components/FoodItem/FoodItem';
import { StoreContext } from '../../context/StoreContext';

const MerchantShop = () => {
  const { adminId } = useParams();
  const [merchant, setMerchant] = useState(null);
  const { url } = useContext(StoreContext); // ✅ Use global backend URL

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await axios.get(`${url}/api/food/by-admin/${adminId}`);
        if (res.data.success) {
          setMerchant(res.data);
        } else {
          console.warn("API responded but success is false:", res.data);
        }
      } catch (err) {
        console.error("Error fetching merchant:", err);
      }
    };

    fetchMerchant();
  }, [adminId, url]);

  if (!merchant) return <div>Loading shop...</div>;

  return (
    <div className="merchant-shop">
      <h2>{merchant.adminName}'s Shop</h2>
      <div className="merchant-food-grid">
        {merchant.foods.map((food) => (
          <FoodItem
            key={food._id}
            id={food._id}
            name={food.name}
            price={food.price}
            description={food.description}
            image={food.image}
          />
        ))}
      </div>
    </div>
  );
};

export default MerchantShop;
