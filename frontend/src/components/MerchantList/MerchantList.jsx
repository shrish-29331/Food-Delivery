import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MerchantList.css';
import { useNavigate } from 'react-router-dom';

const MerchantList = ({ selectedCategory }) => {
  const [merchants, setMerchants] = useState([]);
  const url = "https://food-delivery-xvni.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await axios.get(`${url}/api/food/by-merchants`);
        if (res.data.success) {
          setMerchants(res.data.merchants);
        }
      } catch (err) {
        console.error("Error fetching merchants:", err);
      }
    };

    fetchMerchants();
  }, [selectedCategory]);

  return (
    <div className="merchant-list">
      {merchants.map((merchant, index) => {
        const filteredFoods = merchant.foods.filter(food => {
          const cat = food.category?.toLowerCase().trim();
          if (selectedCategory === "Food") return cat !== "grocery";
          if (selectedCategory === "Grocery") return cat === "grocery";
          return true;
        });

        if (filteredFoods.length === 0) return null;

        return (
          <div className="merchant-card" key={index}>
            <div className="merchant-card-left">
              <img
                src={`${url}/images/${filteredFoods[0].image}`}
                alt="Shop"
                className="merchant-card-image"
              />
            </div>
            <div className="merchant-card-right">
              <h3>{merchant.adminName}</h3>
              <div className="merchant-icons">
                <span>🕒 30 mins</span>
                <span>🌟 4.2</span>
                <span>📍 2.5 km</span>
              </div>
              <button
                className="view-shop-btn"
                onClick={() => navigate(`/merchant/${merchant.adminId}`)}
              >
                View Shop
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MerchantList;
