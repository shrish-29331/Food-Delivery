import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setTokenState] = useState(localStorage.getItem("token") || "");

  const url = "http://localhost:4000";

  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
    loadCartData(newToken);
  };

  const addToCart = async (itemId) => {
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Add to cart failed", err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] > 1) {
      updatedCart[itemId] -= 1;
    } else {
      delete updatedCart[itemId];
    }
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Remove from cart failed", err);
      }
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const food = food_list.find(f => f._id === itemId);
      return food ? total + food.price * qty : total;
    }, 0);
  };

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/public`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

      if (res.data.success) {
        setFoodList(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching food list", err);
    }
  };

  const loadCartData = async (tok) => {
    if (!tok) return;
    try {
      const res = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { Authorization: `Bearer ${tok}` }
      });
      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("Error loading cart data", err);
    }
  };

  useEffect(() => {
    fetchFoodList();
    if (token) loadCartData(token);
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
