import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${url}/api/food/by-merchants`);
      if (res.data.success) setAllData(res.data.merchants);
    };
    fetchData();
  }, [url]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSearchResults([]);

    const results = [];
    allData.forEach((merchant) => {
      if (merchant.adminName.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'merchant', name: merchant.adminName, id: merchant.adminId });
      }
      merchant.foods.forEach((food) => {
        if (food.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({ type: 'food', name: food.name, merchant: merchant.adminName, id: merchant.adminId });
        }
      });
    });

    setSearchResults(results);
  };

  const handleResultClick = (id) => {
    navigate(`/shop/${id}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search food or merchant..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" />
          {searchQuery.trim() && (
            <div className={`search-results ${searchResults.length === 0 ? 'no-results' : ''}`}>
              {searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <div key={idx} className="search-result" onClick={() => handleResultClick(result.id)}>
                    <span>
                      {result.type === 'merchant' ? `Merchant: ` : `Food: `}
                      <b>{result.name}</b>
                      {result.merchant && <> from <i>{result.merchant}</i></>}
                    </span>
                  </div>
                ))
              ) : (
                <div className="search-result">No results found</div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
