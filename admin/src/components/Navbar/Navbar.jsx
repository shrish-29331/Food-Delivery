import React, { useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { AdminContext } from '../Context/adminContext';

const Navbar = () => {
  const { adminToken, logout } = useContext(AdminContext);

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="Logo" />
      <h2>Admin Panel</h2>
      {adminToken && (
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
