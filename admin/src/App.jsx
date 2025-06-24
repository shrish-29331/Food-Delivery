import React, { useContext } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import Orders from './pages/Orders/Orders';
import List from './pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminContextProvider, { AdminContext } from './components/Context/adminContext';
import AdminLogin from './pages/AdminLogin/AdminLogin';

const AppContent = ({ url }) => {
  const { adminToken } = useContext(AdminContext);

  if (!adminToken) return <AdminLogin url={url} />;

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/list" />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

const App = ({ url = "https://food-delivery-xvni.onrender.com" }) => {
  return (
    <AdminContextProvider>
      <AppContent url={url} />
    </AdminContextProvider>
  );
};

export default App;
