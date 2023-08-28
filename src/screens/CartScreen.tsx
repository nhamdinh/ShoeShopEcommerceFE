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

  const [cartItems, setcartItems] = useState<any>([]);
  const [idCart, setidCart] = useState<any>("");
  // const [productId, setproductId] = useState<any>(
  //   location.pathname ? location.pathname.split("/")[2] : ""
  // );
  // const [qty, setqty] = useState<any>(
  //   location.search ? location.search.split("=")[1] : ""
  // );
  const [total, settotal] = useState<any>(0);

  const { data, error, isSuccess, isLoading } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      let cartItems_temp: any = data?.cartItems || [];
      let total_temp = 0;
      cartItems_temp.map((cart: any) => {
        total_temp += cart?.price * cart?.qty;
      });

      settotal(+total_temp);
      setcartItems(cartItems_temp);
      setidCart(data?._id);
    }
  }, [data]);

  // useEffect(() => {
  //   setproductId(location.pathname ? location.pathname.split("/")[2] : "");
  //   setqty(location.search ? location.search.split("=")[1] : "");
  // }, [location.pathname]);

  const checkOutHandler = (e: any) => {
    // navigate("/login?redirect=shipping");
    e.preventDefault();
    navigate("/shipping");
  };

  const [createCart, { isLoading: LoadingcreateCart }] =
    useCreateCartMutation();

  const onCreateCart = async (value: any) => {
    const res = await createCart(value);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      // navigate(`/cart/${productId}?qty=${qty}`);
      navigate(`/cart`);
    } else {
    }
  };

  const AddToCartHandle = (e: any) => {
    e.preventDefault();
    // onCreateCart({
    //   cartItems: [
    //     {
    //       name: product?.name,
    //       image: product?.image,
    //       price: product?.price,
    //       qty: qty,
    //       product: productId,
    //     },
    //   ],
    // });
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
            return <CompTableCart idCart={idCart} item={item} />;
          })}

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
  );
};

function CompTableCart({ item, idCart }: any) {
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
  const [qty, setQty] = useState<any>(item?.qty);

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
    console.log(item);
    onCreateCart({
      cartItems: [
        {
          name: item?.name,
          image: item?.image,
          price: item?.price,
          qty: item?.qty,
          product: item?.product,
        },
      ],
    });
  };

  return (
    <div className="cart-iterm row" key={item?._id}>
      <div
        onClick={() => removeFromCartHandle(item?.product)}
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
        <h6>PRICE</h6>
        <h4>${formatMoney(item?.price * qty)}</h4>
      </div>
    </div>
  );
}
export default CartScreen;
