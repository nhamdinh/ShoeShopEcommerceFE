import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const PaymentScreen = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart: any = {};
  const { shippingAddress } = cart;

  // if (!shippingAddress) {
  //   navigate("/shipping");
  // }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e: any) => {
    e.preventDefault();
    // dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <div className="container d-flex justify-content-center align-items-center login-center">
      <form
        className="Login2 col-md-8 col-lg-4 col-11"
        onSubmit={submitHandler}
      >
        <h6>SELECT PAYMENT METHOD</h6>
        <div className="payment-container">
          <div className="radio-container">
            <input
              className="form-check-input"
              type="radio"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label">PayPal or Credit Card</label>
          </div>
        </div>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default PaymentScreen;
