import React, { useContext, useEffect, useState } from "react";
import "./Myorders.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
const MyOrders = () => {
  const { url, token } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.map((data,index)=>{
          return(
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{data.items.map((item,index)=>{
                if(index === data.items.length-1){
                  return item.name + " x " + item.quantity
                }
                else{
                    return item.name + " x " + item.quantity +" , "
                }
              })}</p>

              <p>${data.amount}.00</p>
              <p> Items : {data.items.length}</p>
              <p> <span>&#x25cf;</span>    <b>{data.status}</b> </p>
              <button >Track Order</button>

            </div>
          )
        })}
        </div>
    </div>
  );
};

export default MyOrders;
