import "./style.scss";

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../utils/commonFunction";
import {
  useCheckCartQuery,
  useCreateCartMutation,
  useRemoveFromCartMutation,
} from "../store/components/orders/ordersApi";
import { openToast } from "../store/components/customDialog/toastSlice";
import { openDialog } from "../store/components/customDialog/dialogSlice";
import Loading from "../components/LoadingError/Loading";

const CartScreen = () => {
  window.scrollTo(0, 0);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [idCart, setidCart] = useState<any>("");

  const [total, settotal] = useState<any>(0);

  const [cartItems, setcartItems] = useState<any>([]);
  const { data: dataCart, isSuccess: isSuccessCart } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessCart) {
      const productsCart = dataCart?.metadata.flatMap(
        (cart: any) => cart.cart_products
      );

      setcartItems(productsCart || []);

      let cartItems_temp: any = productsCart || [];
      let total_temp = 0;
      cartItems_temp.map((cart: any) => {
        total_temp += cart?.price * cart?.quantity;
      });

      settotal(+total_temp);
    }
  }, [dataCart]);

  const checkOutHandler = (e: any) => {
    e.preventDefault();
    navigate("/shipping");
  };

  return (
    <div className="container">
      {/* Cart */}
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
            <span className="text-success mx-2">({cartItems.length})</span>
          </div>
          {/* cartiterm */}
          {cartItems.map((item: any, index: any) => {
            return <CompTableCart idCart={idCart} item={item} key={index} />;
          })}

          {/* End of cart iterms */}
          <div className="total">
            <span className="sub">total:</span>
            <span className="total-price">${formatMoney(total)}</span>
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
  );
};

function CompTableCart({ item, idCart }: any) {
  useEffect(() => {
    setQty(item?.quantity);
  }, [item]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //@ts-ignore
  const [iterator, setiterator] = useState<any>([...Array(10).keys()]);

  const [removeFromCart, { isLoading: LoadingpayOrder }] =
    useRemoveFromCartMutation();

  const onRemoveFromCart = async (values: any) => {
    const res = await removeFromCart(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Deleted Product From Cart Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Delete Product From Cart Failed",
          step: 2,
        })
      );
    }
  };

  const removeFromCartHandle = (id: any) => {
    dispatch(
      openDialog({
        type: "confirm",
        title: "Are you sure DELETE??",
        actionConfirm: () => {
          onRemoveFromCart({
            cartId: idCart,
            product: id,
          });
        },
        actionAfterClose: () => {},
      })
    );
  };
  const [qty, setQty] = useState<any>(item?.quantity);

  const [createCart, { isLoading: LoadingcreateCart }] =
    useCreateCartMutation();

  const onCreateCart = async (value: any) => {
    const res = await createCart(value);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Updated Quantity Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Updated Quantity Failed",
          step: 2,
        })
      );
    }
  };

  const AddToCartHandle = (item: any) => {
    onCreateCart({
      cartItems: [
        {
          name: item?.name,
          image: item?.image,
          price: item?.price,
          qty: item?.quantity,
          product_id: item?.product_id,
        },
      ],
    });
  };

  return (
    <div className="cart-iterm row">
      <div
        onClick={() => removeFromCartHandle(item?.product_id)}
        className="remove-button d-flex justify-content-center align-items-center"
      >
        <i className="fas fa-times"></i>
      </div>
      <div className="cart-image col-md-3">
        <img src={item?.image} alt="image" />
      </div>
      <div className="cart-text col-md-5 d-flex align-items-center">
        <h4
          onClick={() => {
            navigate(`/product-detail?id=${item?.product_id}`);
          }}
        >
          {item?.name}
        </h4>
      </div>
      <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
        <h6>QUANTITY</h6>
        {LoadingcreateCart ? (
          <Loading />
        ) : (
          <select
            value={qty}
            onChange={(e) => {
              e.preventDefault();

              setQty(+e.target.value);
              AddToCartHandle({ ...item, qty: +e.target.value });
            }}
          >
            {iterator.map((x: any, index: number) => (
              <option key={index} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
        <h6>PRICE TOTAL</h6>
        <h4>
          x {formatMoney(item?.price)}$ = {formatMoney(item?.price * qty)}$
        </h4>
      </div>
    </div>
  );
}
export default CartScreen;
