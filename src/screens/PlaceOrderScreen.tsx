import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import {
  useCheckAddressQuery,
  useCheckCartQuery,
  useCreateOrderMutation,
} from "../store/components/orders/ordersApi";
import { getUserInfo } from "../store/selector/RootSelector";
import { formatMoney } from "../utils/commonFunction";

const PlaceOrderScreen = () => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const userInfo = useSelector(getUserInfo);
  const cart: any = {
    shippingPrice: 35,
    taxPrice: 79,
  };

  const [address, setaddress] = useState<any>({});
  const [totalPrice, settotalPrice] = useState<any>(0);
  const [totalPriceItems, settotalPriceItems] = useState<any>(0);

  const {
    data: dataCheckAddress,
    error: errorCheckAddress,
    isSuccess: isSuccessCheckAddress,
    isLoading: isLoadingCheckAddress,
  } = useCheckAddressQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessCheckAddress) {
      setaddress(dataCheckAddress);
      if (dataCheckAddress?.error) navigate("/shipping");
    }
  }, [dataCheckAddress]);

  const [cartItems, setcartItems] = useState<any>([]);
  const [idCart, setidCart] = useState<any>("");

  const {
    data: dataCheckCart,
    error: errorCheckCart,
    isSuccess,
    isLoading,
  } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setcartItems(dataCheckCart?.cartItems || []);
      setidCart(dataCheckCart?._id);

      let totalPrice_tem = 0;
      dataCheckCart?.cartItems?.map((cartItem: any) => {
        totalPrice_tem += cartItem.qty * cartItem.price;
      });
      settotalPriceItems(totalPrice_tem);
      settotalPrice(totalPrice_tem + cart.shippingPrice + cart.taxPrice);
    }
  }, [dataCheckCart]);

  const [createOrder, { isLoading: LoadingcreateOrder, error }] =
    useCreateOrderMutation();

  const onCreateOrder = async (values: any) => {
    const res = await createOrder(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
      navigate(`/order/${data._id}`);
    } else {
    }
  };

  const placeOrderHandler = () => {
    onCreateOrder({
      orderItems: [...cartItems],
      cart: idCart,
      shippingAddress: address?._id,
      paymentMethod: "Paypal",
      shippingPrice: +cart.shippingPrice,
      taxPrice: +cart.taxPrice,
      totalPriceItems: +totalPriceItems,
      totalPrice: +totalPrice,
    });
  };

  return (
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
                <td>${formatMoney(totalPriceItems)}</td>
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
  );
};

export default PlaceOrderScreen;
