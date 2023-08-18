import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../utils/commonFunction";
import { useCheckCartQuery } from "../store/components/orders/ordersApi";

const CartScreen = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setcartItems] = useState<any>([]);
  const [idCart, setidCart] = useState<any>("");
  const [productId, setproductId] = useState<any>(
    location.pathname ? location.pathname.split("/")[2] : ""
  );
  const [qty, setqty] = useState<any>(
    location.search ? location.search.split("=")[1] : ""
  );

  const total = 100;
  //@ts-ignore
  const [iterator, setiterator] = useState<any>([...Array(10).keys()]);

  const { data, error, isSuccess, isLoading } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setcartItems(data?.cartItems);
      setidCart(data?._id);
    }
  }, [data]);

  useEffect(() => {
    setproductId(location.pathname ? location.pathname.split("/")[2] : "");
    setqty(location.search ? location.search.split("=")[1] : "");
  }, [location.pathname]);

  const checkOutHandler = (e: any) => {
    // navigate("/login?redirect=shipping");
    e.preventDefault();
    navigate("/shipping");
  };

  const removeFromCartHandle = (id: any) => {
    // dispatch(removefromcart(id));
  };
  return (
    <>
      {/* Cart */}
      <div className="container">
        {cartItems.length === 0 ? (
          <div className=" alert alert-info text-center mt-3">
            Your cart is empty
            <Link
              className="btn btn-success mx-5 px-5 py-3"
              to="/"
              style={{
                fontSize: "12px",
              }}
            >
              SHOPPING NOW
            </Link>
          </div>
        ) : (
          <>
            <div className=" alert alert-info text-center mt-3">
              Total Cart Products
              <Link className="text-success mx-2" to="/cart">
                ({cartItems.length})
              </Link>
            </div>
            {/* cartiterm */}
            {cartItems.map((item: any) => (
              <div className="cart-iterm row">
                <div
                  onClick={() => removeFromCartHandle(item?._id)}
                  className="remove-button d-flex justify-content-center align-items-center"
                >
                  <i className="fas fa-times"></i>
                </div>
                <div className="cart-image col-md-3">
                  <img src={item?.image} alt={item?.name} />
                </div>
                <div className="cart-text col-md-5 d-flex align-items-center">
                  <h4
                    onClick={() => {
                      navigate(`/product-detail?id=${item?.product}`);
                    }}
                  >
                    {item?.name}
                  </h4>
                </div>
                <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
                  <h6>QUANTITY</h6>
                  <select
                    value={item?.qty}
                    onChange={(e) => {
                      // dispatch(addToCart(item?._id, Number(e.target.value)))
                    }}
                  >
                    {iterator.map((x: any, index: number) => (
                      <option key={index} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
                  <h6>PRICE</h6>
                  <h4>${formatMoney(item?.price * item?.qty)}</h4>
                </div>
              </div>
            ))}

            {/* End of cart iterms */}
            <div className="total">
              <span className="sub">total:</span>
              <span className="total-price">${total}</span>
            </div>
            <hr />
            <div className="cart-buttons d-flex align-items-center row">
              <Link to="/" className="col-md-6 ">
                <button>Continue To Shopping</button>
              </Link>
              {total > 0 && (
                <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                  <button onClick={checkOutHandler}>Checkout</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartScreen;
