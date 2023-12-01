import "./style.scss";

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../utils/commonFunction";
import {
  useCheckAddressQuery,
  useCheckCartQuery,
  useCheckoutCartMutation,
  useCheckoutOrderMutation,
  useCreateCartMutation,
} from "../store/components/orders/ordersApi";
import { openToast } from "../store/components/customDialog/toastSlice";
import { openDialog } from "../store/components/customDialog/dialogSlice";
import Loading from "../components/LoadingError/Loading";
import { useGetCouponsByShopsMutation } from "../store/components/coupons/couponsApi";
import { Checkbox } from "antd";
import moment from "moment";

import { FORMAT_DATE8 } from "../utils/constants";
import { setStcheckoutCartsParam } from "../store/components/orders/ordersSlice";
import { getCheckoutCartsParam } from "../store/selector/RootSelector";

const CartScreen = () => {
  // window.scrollTo(0, 0);
  // const checkedCarts = useSelector(getCheckedCarts);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutCartsParam = useSelector(getCheckoutCartsParam);
  const [total, settotal] = useState<any>(1);
  const [cartCurrents, setcartCurrents] = useState<any>([]);
  // const [cartReviews, setcartReviews] = useState<any>([]);
  const [discount_shopIds, setdiscount_shopIds] = useState<any>([]);
  const [addressId, setaddressId] = useState<any>("");
  // console.log(addressId)
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
      setaddressId(dataCheckAddress?._id);
    }
  }, [dataCheckAddress]);

  const [checkoutOrder, { isLoading: is, error: er }] =
    useCheckoutOrderMutation();
  const onCheckoutOrder = async (checkout_cart: any) => {
    // console.log(checkout_cart);
    const res = await checkoutOrder(checkout_cart);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      if (data?.metadata?.length > 0) {
        navigate(`/profile`);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "Checkout order Success",
            step: 1,
          })
        );
      }

      // navigate(`/cart/${productId}?qty=${qty}`);
      // navigate(`/cart`);
      // dispatch(
      //   openToast({
      //     isOpen: Date.now(),
      //     content: "Apply coupon Success",
      //     step: 1,
      //   })
      // );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Checkout Cart Failed !",
          step: 2,
        })
      );
    }
  };

  // console.log(cartReviews);
  const [getCouponsByShops, { isLoading, error }] =
    useGetCouponsByShopsMutation();

  const onGetCouponsByShops = async (values: any) => {
    // console.log(values);
    const res = await getCouponsByShops(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      const discountsCurrents_temp: any = data?.metadata;

      const cartCurrents_temp: any = cartCurrents;
      const cartCurrents_emp: any = [];
      const cartReviews_emp: any = [];
      cartCurrents_temp.map((cart: any) => {
        const cart_shopId = cart?.cart_shopId?._id;
        let cartObj;
        let cartReviewObj;
        for (let i = 0; i < discountsCurrents_temp.length; i++) {
          const discount_shopId = discountsCurrents_temp[i]?.discount_shopId;
          if (cart_shopId === discount_shopId) {
            cartObj = {
              ...cart,
              ...discountsCurrents_temp[i],
            };
            cartReviewObj = {
              cartId: cart?._id,
              orderItems: [
                {
                  shopId: cart_shopId,
                  itemProducts: cart?.cart_products,
                  shopDiscount: [],
                },
              ],
            };
          }
        }
        cartCurrents_emp.push(cartObj);
        cartReviews_emp.push(cartReviewObj);
      });
      // setcartReviews(cartReviews_emp);
      dispatch(setStcheckoutCartsParam(cartReviews_emp));

      setcartCurrents(cartCurrents_emp);
    } else {
    }
  };
  useEffect(() => {
    if (discount_shopIds.length > 0) {
      onGetCouponsByShops({ discount_shopIds });
    }
  }, [discount_shopIds]);

  const [cartItems, setcartItems] = useState<any>([]);
  const { data: dataCart, isSuccess: isSuccessCart } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  // console.log(cartCurrents);
  useEffect(() => {
    if (isSuccessCart) {
      const cartsFetched: any = dataCart?.metadata;
      setcartCurrents(cartsFetched);
      if (cartsFetched.length > 0) {
        const productsCart = cartsFetched.flatMap(
          (cart: any) => cart.cart_products
        );

        setcartItems(productsCart || []);
        const shopIds: any = [];
        cartsFetched.map((cart: any) => {
          shopIds.push(cart?.cart_shopId?._id);
        });
        setdiscount_shopIds(shopIds);
      }
    }
  }, [dataCart]);

  // useEffect(() => {
  //   // console.log(checkedCarts);

  //   settotal(
  //     [...checkedCarts].reduce((acc, total) => {
  //       return +acc + +total?.totalAmountPay;
  //     }, 0)
  //   );
  // }, [checkedCarts]);

  // const checkOutHandler = (e: any) => {
  //   e.preventDefault();
  //   navigate("/shipping");
  // };

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
          {cartCurrents.map((cartCurrent: any, index: any) => {
            return (
              cartCurrent?.cart_products.length > 0 && (
                <CompTableCartLv1 cartCurrent={cartCurrent} key={index} />
              )
            );
          })}

          {/* End of cart iterms */}
          {/*           <div className="total">
            <span className="sub">total:</span>
            <span className="total-price">${formatMoney(total)}</span>
          </div>
          <hr /> */}
          <div className="cart-buttons d-flex align-items-center row">
            <Link to="/" className="col-md-6 ">
              <button>Continue To Shopping</button>
            </Link>
            {total > 0 && (
              <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                <button
                  onClick={() => {
                    onCheckoutOrder(checkoutCartsParam);
                  }}
                >
                  {is ? <Loading /> : "Checkout"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
const CompTableCartLv1 = ({ cartCurrent }: any) => {
  const checkoutCartsParam = useSelector(getCheckoutCartsParam);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shopTotal, setshopTotal] = useState<any>(0);
  const [checkedCart, setcheckedCart] = useState<any>({});

  // console.log(checkedCart)

  const [discount_shopId, setdiscount_shopId] = useState<any>(
    cartCurrent?.cart_shopId?._id
  );
  const [dataFetched, setdataFetched] = useState<any>([]);

  const [totalCount, settotalCount] = useState<any>(0);
  /*  */
  const [cartId, setcartId] = useState<any>("");
  const [shopId, setshopId] = useState<any>("");
  const [itemProducts, setitemProducts] = useState<any>([]);

  useEffect(() => {
    const total_temp = cartCurrent?.cart_products.reduce(
      (acc: number, cart: any) => {
        return +acc + +cart?.price * +cart?.quantity;
      },
      0
    );

    setshopTotal(+total_temp);
    setdiscount_shopId(cartCurrent?.cart_shopId?._id);
    /*  */
    const cartId_temp = cartCurrent?._id,
      shopId_temp = cartCurrent?.cart_shopId?._id,
      itemProducts_temp = [...cartCurrent?.cart_products];

    setcartId(cartId_temp);
    setshopId(shopId_temp);
    setitemProducts(itemProducts_temp);
    const checkout_cart_temp = {
      cartId: cartId_temp,
      orderItems: [
        {
          shopId: shopId_temp,
          itemProducts: itemProducts_temp,
          shopDiscount: [],
        },
      ],
    };
    onCheckoutCart([checkout_cart_temp]);

    /*  */

    if (cartCurrent?.discounts?.length > 0) {
      let dataFetched_temp: any = [];
      cartCurrent?.discounts.map((data: any, index: number) => {
        dataFetched_temp.push({ ...data, checked: false, index: index + 1 });
      });
      setdataFetched(dataFetched_temp);
    }
  }, [cartCurrent]);

  const [checkoutCart, { isLoading: is, error: er }] =
    useCheckoutCartMutation();
  const onCheckoutCart = async (checkout_cart: any) => {
    // console.log(checkout_cart);
    const res = await checkoutCart(checkout_cart);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      if (data?.metadata?.length > 0) {
        setcheckedCart(data?.metadata[0]?.checkCart);
      }

      // navigate(`/cart/${productId}?qty=${qty}`);
      // navigate(`/cart`);
      // dispatch(
      //   openToast({
      //     isOpen: Date.now(),
      //     content: "Apply coupon Success",
      //     step: 1,
      //   })
      // );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Apply coupon Failed !",
          step: 2,
        })
      );
    }
  };

  return (
    <>
      <div
        className="STORE cursor__pointer"
        onClick={() => {
          navigate(`/shop/${cartCurrent?.cart_shopId?._id}`);
        }}
      >
        STORE: <h1> {cartCurrent?.cart_shopId?.productShopName}</h1>
      </div>
      {cartCurrent?.cart_products.map((item: any, ind: any) => (
        <CompTableCartLv2
          itemProduct={item}
          cart_shopId={cartCurrent?.cart_shopId}
          key={ind}
        />
      ))}
      <div className="flex-box d-flex justify-content-between align-items-center gap10px">
        <h6 className="form-label">discounts</h6>
        <div className="ProductsShopTable__row">
          <div className="ProductsShopTable">
            {dataFetched.map((coupon: any, index: number) => {
              // console.log(shopTotal)
              const isNotValid = shopTotal < coupon?.discount_order_minValue;
              const checked = coupon?.checked;
              return (
                <div
                  className={`ProductsShopTable__row ${
                    isNotValid ? "zzP" : ""
                  }`}
                  key={index}
                >
                  <Checkbox
                    checked={checked}
                    onChange={(e: any) => {
                      let dataFetched_temp: any = [...dataFetched];

                      dataFetched_temp.map((data: any) => {
                        if (coupon?._id === data?._id && !isNotValid) {
                          data.checked = !data.checked;
                        }
                      });

                      if (!isNotValid) {
                        const shopDiscount_temp: any = [];
                        dataFetched_temp
                          .filter((coupon: any) => coupon.checked)
                          .map((item: any) => {
                            shopDiscount_temp.push({
                              discount_shopId: item?._id,
                              discount_code: item?.discount_code,
                            });
                          });

                        const checkout_cart_temp = {
                          cartId,
                          orderItems: [
                            {
                              shopId,
                              itemProducts,
                              shopDiscount: [...shopDiscount_temp],
                            },
                          ],
                        };
                        const checkoutCartsParam_temp: any = [
                          ...checkoutCartsParam,
                        ];
                        const checkoutCartsParam_emp: any = [];
                        checkoutCartsParam_temp.map((cartReview: any) => {
                          if (
                            cartReview?.cartId === checkout_cart_temp.cartId
                          ) {
                            checkoutCartsParam_emp.push({
                              ...cartReview,
                              orderItems: checkout_cart_temp.orderItems,
                            });
                          } else {
                            checkoutCartsParam_emp.push(cartReview);
                          }
                        });
                        console.log(checkoutCartsParam_emp);

                        dispatch(
                          setStcheckoutCartsParam(checkoutCartsParam_emp)
                        );

                        onCheckoutCart([checkout_cart_temp]);
                      }

                      setdataFetched(dataFetched_temp);
                    }}
                  ></Checkbox>
                  <div className="name">{coupon?.index}.</div>
                  <div
                    className="dropdown-row "
                    onClick={(e) => {
                      e.stopPropagation();
                      // submitHandler(item?.name, brand);
                    }}
                    key={coupon?._id}
                  >
                    <div className="name w200px">{coupon?.discount_code}</div>

                    <div className="name">
                      decrease:{" "}
                      {coupon?.discount_type === "percent"
                        ? coupon?.discount_value + "%"
                        : formatMoney(coupon?.discount_value) + "$"}
                      &ensp; min order:{" "}
                      {formatMoney(coupon?.discount_order_minValue)}
                    </div>
                    <div className="name"></div>
                    <div className="name">
                      {coupon?.discount_applyTo === "all" ? "all" : "limit"}
                      &ensp;
                      {moment(coupon?.discount_start).format(FORMAT_DATE8)}
                      &ensp;
                      {moment(coupon?.discount_end).format(FORMAT_DATE8)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="total">
        <span className="sub">shop total :</span>
        <span className="total-price">${formatMoney(shopTotal)}</span>
      </div>
      <div className="total mt0px">
        <span className="sub">feeShip :</span>
        <span className="total-price">
          ${formatMoney(checkedCart?.feeShip ?? 0)}
        </span>
      </div>
      <div className="total mt0px">
        <span className="sub">Discount total :</span>
        <span className="total-price">
          ${formatMoney(checkedCart?.totalDiscount ?? 0)}
        </span>
      </div>
      <div className="total mt0px">
        <span className="sub">AmountPay total :</span>
        <span className="total-price">
          ${formatMoney(checkedCart?.totalAmountPay ?? 0)}
        </span>
      </div>
    </>
  );
};

const CompTableCartLv2 = ({ itemProduct, cart_shopId }: any) => {
  useEffect(() => {
    setQty(itemProduct?.quantity);
  }, [itemProduct]);
  const [qty, setQty] = useState<any>(itemProduct?.quantity);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //@ts-ignore
  const [iterator, setiterator] = useState<any>([...Array(10).keys()]);

  const [createCart, { isLoading: LoadingcreateCart }] =
    useCreateCartMutation();

  const onCreateCart = async (value: any) => {
    const res = await createCart(value);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      // navigate(`/cart/${productId}?qty=${qty}`);
      // navigate(`/cart`);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Updated Cart Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Need to Login First !",
          step: 2,
        })
      );
    }
  };

  const AddToCartHandle = (itemX: any) => {
    onCreateCart({
      product: {
        cart_shopId: cart_shopId?._id,
        product_id: itemX?.product_id,
        quantity: +itemX.quantity,
        price: itemX?.price,
        name: itemX?.name,
        image: itemX?.image,
      },
    });
  };
  const removeFromCartHandle = (itemX: any) => {
    dispatch(
      openDialog({
        type: "confirm",
        title: "Are you sure DELETE??",
        actionConfirm: () => {
          onCreateCart({
            product: {
              cart_shopId: cart_shopId?._id,
              product_id: itemX?.product_id,
              quantity: 0,
              price: itemX?.price,
              name: itemX?.name,
              image: itemX?.image,
            },
          });
        },
        actionAfterClose: () => {},
      })
    );
  };
  return (
    <div className="cart-iterm row">
      <div
        onClick={() => removeFromCartHandle(itemProduct)}
        className="remove-button d-flex justify-content-center align-items-center"
      >
        <i className="fas fa-times"></i>
      </div>
      <div
        className="cart-image col-md-3 cursor__pointer"
        onClick={() => {
          navigate(`/product-detail?id=${itemProduct?.product_id}`);
        }}
      >
        <img src={itemProduct?.image} alt="image" />
      </div>
      <div className="cart-text col-md-5 d-flex align-items-center">
        <h4>{itemProduct?.name}</h4>
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
              AddToCartHandle({ ...itemProduct, quantity: +e.target.value });
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
          x {formatMoney(itemProduct?.price)}$ ={" "}
          {formatMoney(itemProduct?.price * qty)}$
        </h4>
      </div>
    </div>
  );
};
export default CartScreen;
