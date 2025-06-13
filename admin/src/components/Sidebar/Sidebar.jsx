import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'; // <- Add this!

import { AdminContext } from '../Context/adminContext'

const Sidebar = () => {
    const { adminToken } = useContext(AdminContext);

  if (!adminToken) {
    return <div className="sidebar-locked">Login to access admin features</div>;
  }
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list'className="sidebar-option">
                <img src={assets.order_icon} alt=""/>
            <p>List Items</p>

            </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <img src={assets.order_icon} alt=""/>
            <p>Orders</p>
            
            </NavLink>
            
        </div>
      
    </div>
  )
}

export default Sidebar
