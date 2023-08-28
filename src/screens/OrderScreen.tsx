import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import { PayPalButton } from "react-paypal-button-v2";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";
import axios from "axios";
import {
  useGetOrderDetailQuery,
  usePayOrderMutation,
} from "../store/components/orders/ordersApi";
import Toast from "../components/LoadingError/Toast";
import { toast } from "react-toastify";
import { Toastobjects } from "../utils/constants";
import { formatCustomerPhoneNumber } from "../utils/commonFunction";

const OrderScreen = () => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const location = useLocation();
  const [sdkReady, setSdkReady] = useState<any>(false);
  const [order, setorderDetails] = useState<any>({});
  const [orderId, setorderId] = useState<any>(location.pathname.split("/")[2]);
  const dispatch = useDispatch();
  const {
    data: dataFetch,
    error,
    isSuccess,
    isLoading,
  } = useGetOrderDetailQuery(
    { orderId: orderId },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      setorderDetails(dataFetch);

      const addPayPalScript = async () => {
        const { data: clientId } = await axios.get(
          "http://localhost:5000/api/config/paypal"
        );
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dataFetch]);

  const orderPay: any = {};
  const { loading: loadingPay, success: successPay } = orderPay;

  useEffect(() => {
    setorderId(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const [payOrder, { isLoading: LoadingpayOrder }] = usePayOrderMutation();

  const onPayOrder = async (values: any) => {
    const res = await payOrder(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
      toast.success("Pay Success", Toastobjects);
    } else {
    }
  };

  const successPaymentHandler = (paymentResult: any) => {
    console.log(paymentResult);
    onPayOrder({ orderId: orderId, ...paymentResult });
  };

  return (
    <>
      <Toast />

      <div className="container">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Message
            variant="alert-danger"
            mess={JSON.stringify(error)}
          ></Message>
        ) : (
          <>
            <div className="row  order-detail">
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Customer</strong>
                    </h5>
                    <p>{order?.user?.name}</p>
                    <p>{formatCustomerPhoneNumber(order?.user?.phone)}</p>
                    <p>
                      <a href={`mailto:${order?.user?.email}`}>
                        {order?.user?.email}
                      </a>
                    </p>
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
                    <p>Shipping: {order?.shippingAddress?.country}</p>
                    <p>Pay method: {order?.paymentMethod}</p>
                    {order?.isPaid ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Paid on {moment(order?.paidAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Not Paid
                        </p>
                      </div>
                    )}
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
                      Address: {order?.shippingAddress?.city},{" "}
                      {order?.shippingAddress?.street},{" "}
                      {order?.shippingAddress?.postalCode}
                    </p>
                    {order?.isDelivered ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Delivered on {moment(order?.deliveredAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Not Delivered
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row order-products justify-content-between">
              <div className="col-lg-8">
                {order?.orderItems?.length === 0 ? (
                  <Message
                    variant="alert-info mt-5"
                    mess="Your order is empty"
                  ></Message>
                ) : (
                  <>
                    {order?.orderItems?.map((item: any, index: any) => (
                      <div className="order-product row" key={index}>
                        <div className="col-md-3 col-6">
                          <img src={item?.image} alt={item?.name} />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <h6
                            onClick={() => {
                              navigate(`/product-detail?id=${item?.product}`);
                            }}
                          >
                            {item?.name}
                          </h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                          <h4>QUANTITY</h4>
                          <h6>{item?.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                          <h4>SUBTOTAL</h4>
                          <h6>${item?.qty * item?.price}</h6>
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
                      <td>${order?.totalPriceItems}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Shipping</strong>
                      </td>
                      <td>${order?.shippingPrice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Tax</strong>
                      </td>
                      <td>${order?.taxPrice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>${order?.totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
                {!order.isPaid && (
                  <div className="col-12">
                    {!sdkReady ? (
                      <Loading />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;
