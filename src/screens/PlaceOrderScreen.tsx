import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import {
  useCheckAddressQuery,
  useCreateOrderMutation,
} from "../store/components/orders/ordersApi";
import { getCartInfo, getUserInfo } from "../store/selector/RootSelector";
import {
  formatCustomerPhoneNumber,
  formatMoneyCurrency,
} from "../utils/commonFunction";
import { SHIPPINGPRICE, TAXPRICE } from "../utils/constants";

const PlaceOrderScreen = () => {
  window.scrollTo(0, 0);
  const cartInfo = useSelector(getCartInfo);
  console.log(cartInfo);
  const navigate = useNavigate();

  const userInfo = useSelector(getUserInfo);
  const cart: any = {
    shippingPrice: SHIPPINGPRICE,
    paymentMethod: cartInfo?.paymentMethod,
  };

  const [address, setaddress] = useState<any>({});
  const [totalPrice, settotalPrice] = useState<any>(0);
  const [taxPrice, settaxPrice] = useState<any>(0);
  const [totalPriceItems, settotalPriceItems] = useState<any>(0);
  console.log(address);
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

  useEffect(() => {
    setcartItems(cartInfo?.cartItems || []);
    setidCart(cartInfo?._id);

    let totalPrice_tem = 0;
    cartInfo?.cartItems?.map((cartItem: any) => {
      totalPrice_tem += cartItem.qty * cartItem.price;
    });
    let taxPrice_tem = (totalPrice_tem * TAXPRICE).toFixed(2);

    settaxPrice(taxPrice_tem);
    settotalPriceItems(totalPrice_tem);
    settotalPrice(
      (+totalPrice_tem + +cart.shippingPrice + +taxPrice_tem).toFixed(2)
    );
  }, [cartInfo]);

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
      shippingAddress: {
        ...address,
        address: address?._id,
      },
      paymentMethod: "Paypal",
      shippingPrice: +cart.shippingPrice,
      taxPrice: +taxPrice,
      totalPriceItems: +totalPriceItems,
      totalPrice: +totalPrice,
      user: { ...userInfo },
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
              <p>{formatCustomerPhoneNumber(userInfo?.phone)}</p>
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
                    <h6>${formatMoneyCurrency(item.qty * item.price)}</h6>
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
                <td>${formatMoneyCurrency(totalPriceItems)}</td>
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
                <td>${taxPrice}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>${formatMoneyCurrency(totalPrice)}</td>
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
