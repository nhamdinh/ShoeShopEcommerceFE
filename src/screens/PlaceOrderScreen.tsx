import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Message from "../components/LoadingError/Error";
import { useCheckAddressMutation } from "../store/components/orders/ordersApi";
import { getUserInfo } from "../store/selector/RootSelector";
import { CART_STORAGE } from "../utils/constants";
import { formatMoney } from "../utils/commonFunction";

const PlaceOrderScreen = () => {
  window.scrollTo(0, 0);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const cart: any = {};
  console.log(cart)
  const userLogin: any = {};
  const [address, setaddress] = useState<any>({});
  const [totalPrice, settotalPrice] = useState<any>(0);

  const [checkAddress, { isLoading: LoadingcheckAddress }] =
    useCheckAddressMutation();

  const onCheckAddress = async () => {
    const res = await checkAddress({});
    //@ts-ignore
    const data = res?.data;
    if (data) {
      setaddress(data);
      // if (data?.error) navigate("/shipping");
    } else {
    }
  };

  useEffect(() => {
    onCheckAddress();
  }, []);

  const [cartItems, setcartItems] = useState<any>([]);
  useEffect(() => {
    let cartStorage: any = localStorage.getItem(CART_STORAGE);
    let cartParse = cartStorage ? JSON.parse(cartStorage) : null;
    let cartItems: any = cartParse ? cartParse.cartItems : [];
    let totalPrice_tem = 0;
    cartItems.map((cartItem: any) => {
      totalPrice_tem += cartItem.qty * cartItem.price;
    });
    settotalPrice(totalPrice_tem);
    setcartItems(cartItems);
  }, [location.pathname]);

  // Calculate Price
  const addDecimals = (num: any) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // cart?.itemsPrice = addDecimals(
  //   cart?.cartItems?.reduce(
  //     (acc: any, item: any) => acc + item.price * item.qty,
  //     0
  //   )
  // );
  cart.shippingPrice = addDecimals(cart?.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.15 * cart?.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart?.itemsPrice) +
    Number(cart?.shippingPrice) +
    Number(cart?.taxPrice)
  ).toFixed(2);

  const orderCreate: any = {};
  const { order, success, error } = orderCreate;

  // useEffect(() => {
  //   if (success) {
  //     history.push(`/order/${order._id}`);
  //     dispatch({ type: ORDER_CREATE_RESET });
  //   }
  // }, [history, dispatch, success, order]);

  const placeOrderHandler = () => {
    // dispatch(
    //   createOrder({
    //     orderItems: cart?.cartItems,
    //     shippingAddress: cart?.shippingAddress,
    //     paymentMethod: cart?.paymentMethod,
    //     itemsPrice: cart?.itemsPrice,
    //     shippingPrice: cart?.shippingPrice,
    //     taxPrice: cart?.taxPrice,
    //     totalPrice: cart?.totalPrice,
    //   })
    // );
  };

  return (
    <>
      <div className="container">
        <div className="row  order-detail">
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row ">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Customer</strong>
                </h5>
                <p>{userInfo?.name}</p>
                <p>{userInfo?.email}</p>
              </div>
            </div>
          </div>
          {/* 2 */}
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i className="fas fa-truck-moving"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Order info</strong>
                </h5>
                <p>Shipping: {address?.country}</p>
                <p>Pay method: {cart?.paymentMethod}</p>
              </div>
            </div>
          </div>
          {/* 3 */}
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Deliver to</strong>
                </h5>
                <p>
                  Address: {address?.street}, {address?.city},{" "}
                  {address?.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row order-products justify-content-between">
          <div className="col-lg-8">
            {cartItems?.length === 0 ? (
              <Message
                variant="alert-info mt-5"
                mess="Your cart is empty"
              ></Message>
            ) : (
              <>
                {cartItems?.map((item: any, index: any) => (
                  <div className="order-product row" key={index}>
                    <div className="col-md-3 col-6">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="col-md-5 col-6 d-flex align-items-center">
                      <h6
                        onClick={() => {
                          navigate(`/product-detail?id=${item?._id}`);
                        }}
                      >
                        {item.name}
                      </h6>
                    </div>
                    <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                      <h4>QUANTITY</h4>
                      <h6>{item.qty}</h6>
                    </div>
                    <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                      <h4>SUBTOTAL</h4>
                      <h6>${formatMoney(item.qty * item.price)}</h6>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {/* total */}
          <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <strong>Products</strong>
                  </td>
                  <td>${cart?.itemsPrice}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Shipping</strong>
                  </td>
                  <td>${cart?.shippingPrice}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tax</strong>
                  </td>
                  <td>${cart?.taxPrice}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>${formatMoney(totalPrice)}</td>
                </tr>
              </tbody>
            </table>
            {cartItems?.length === 0 ? null : (
              <button type="submit" onClick={placeOrderHandler}>
                PLACE ORDER
              </button>
            )}
            {error && (
              <div className="my-3 col-12">
                <Message
                  variant="alert-danger"
                  mess={JSON.stringify(error)}
                ></Message>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
