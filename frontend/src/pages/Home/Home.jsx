import React, { useState } from 'react';

import Header from '../../components/Header/Header';
import './Home.css';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import MerchantList from '../../components/MerchantList/MerchantList'; // ⬅️ New import

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* 🧠 Main logic starts here */}
      {category === "Food" ? (
     <MerchantList selectedCategory="Food" />
        ) : category === "Groceries" ? (
        <MerchantList selectedCategory="Grocery" />
       ) : (
         <MerchantList selectedCategory="All" />
        )}


      
    </div>
  );
};

export default Home;
