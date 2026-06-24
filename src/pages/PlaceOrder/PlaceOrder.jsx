import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();


 
  const { getTotalCartAmount, token, food_list, cartItem, url } =
    useContext(StoreContext);


 useEffect(() => {
   if (getTotalCartAmount() === 0) {
     navigate("/cart");
   }
 }, [getTotalCartAmount, navigate]);



  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
     if (getTotalCartAmount() === 0) {
       alert("Cart is empty");
       return;
     }

    const sdkLoaded = await loadRazorpay();

    if (!sdkLoaded) {
      alert("Razorpay SDK Failed To Load");
      return;
    }

    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItem[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItem[item._id],
        });
      }
    });

    const amount = getTotalCartAmount() + 2;

    try {
      const orderResponse = await axios.post(
        `${url}/api/payment/create-order`,
        { amount },
        {
          headers: {
            token,
          },
        },
      );

      if (!orderResponse.data.success) {
        alert("Unable to create payment order");
        return;
      }

      const order = orderResponse.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay Key

        amount: order.amount,

        currency: order.currency,

        name: "Food Delivery",

        description: "Food Order Payment",

        order_id: order.id,

        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },

        notes: {
          address: data.street,
        },

        theme: {
          color: "#3399cc",
        },

        handler: async function (response) {
          try {
          const verifyResponse = await axios.post(
            `${url}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: data,
              items: orderItems,
              amount,
            },
            {
              headers: { token },
            },
          );

          console.log("VERIFY RESPONSE:", verifyResponse.data);

            if (verifyResponse.data.success) {
              alert("Payment Successful");

              navigate("/myorders");
            } else {
              alert(
                verifyResponse.data.message || "Payment Verification Failed",
              );
            }
          } catch (error) {
            console.log(error);

            alert("Payment Verification Failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);

        alert(`Payment Failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (error) {
      console.log(error);

      alert("Payment Failed");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            type="text"
            name="firstName"
            placeholder="First Name"
            value={data.firstName}
            onChange={handleChange}
          />

          <input
            required
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={data.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
        />

        <input
          required
          type="text"
          name="street"
          placeholder="Street"
          value={data.street}
          onChange={handleChange}
        />

        <div className="multi-fields">
          <input
            required
            type="text"
            name="city"
            placeholder="City"
            value={data.city}
            onChange={handleChange}
          />

          <input
            required
            type="text"
            name="state"
            placeholder="State"
            value={data.state}
            onChange={handleChange}
          />
        </div>

        <div className="multi-fields">
          <input
            required
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            value={data.zipcode}
            onChange={handleChange}
          />

          <input
            required
            type="text"
            name="country"
            placeholder="Country"
            value={data.country}
            onChange={handleChange}
          />
        </div>

        <input
          required
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={data.phone}
          onChange={handleChange}
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>

          <hr />

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
