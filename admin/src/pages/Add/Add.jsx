// src/pages/Add/Add.jsx
import React, { useState, useContext } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';
import { AdminContext } from '../../components/Context/adminContext';

const Add = ({ url }) => {
  const { adminToken } = useContext(AdminContext);  // only token needed
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Food"
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) return toast.error("Please upload an image.");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image); // no adminId here

    try {
      const res = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          token: adminToken,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        setData({ name: "", description: "", price: "", category: "Food" });
        setImage(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong while adding the item.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input type="file" id="image" hidden required onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input type="text" name="name" value={data.name} onChange={onChangeHandler} required placeholder='Type here' />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea name="description" value={data.description} onChange={onChangeHandler} rows="6" required placeholder='Write content here' />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
             <select name="category" value={data.category} onChange={onChangeHandler}>
                <option value="Food">Food</option>
                <option value="Grocery">Grocery</option> {/* ✅ Here’s your missing one */}
              </select>

          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input type="number" name="price" value={data.price} onChange={onChangeHandler} required placeholder='₹ Price' />
          </div>
        </div>

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
