import React, { useContext, useEffect, useState } from "react";
import "./Myorders.css";
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
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <h3>No Orders Found</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "8px",
            }}
          >
            <p>
              <b>Order ID:</b> {order._id}
            </p>

            <p>
              <b>Amount:</b> ₹{order.amount}
            </p>

            <p>
              <b>Status:</b> {order.status}
            </p>

            <p>
              <b>Payment:</b> {order.payment ? "Paid" : "Pending"}
            </p>

            <p>
              <b>Date:</b> {new Date(order.date).toLocaleString()}
            </p>

            <hr />

            <h4>Items</h4>

            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} × {item.quantity}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
