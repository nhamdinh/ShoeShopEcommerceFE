import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Rating from "../components/homeComponents/Rating";
import Message from "../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Loading from "../components/LoadingError/Loading";
import moment from "moment";
import { getUrlParams } from "../utils/commonFunction";
import { useGetProductsDetailQuery } from "../store/components/products/productsApi";
import { useCreateCartMutation } from "../store/components/orders/ordersApi";
import { CART_STORAGE } from "../utils/constants";

const SingleProduct = ({ history, match }: any) => {
  const [rating, setRating] = useState<any>(0);
  const [comment, setComment] = useState<any>("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const productId = getUrlParams("id");
  const [product, setdataFetched] = useState<any>({});
  const [qty, setQty] = useState<any>(1);
  const {
    data: dataFetch,
    error,
    isSuccess,
    isLoading,
  } = useGetProductsDetailQuery(
    {
      id: productId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  //@ts-ignore
  const [iterator, setiterator] = useState<any>([...Array(10).keys()]);
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataFetch);
    }
  }, [dataFetch]);
  // const productDetails = useSelector((state) => state.productDetails);
  // const { loading, error, product } = productDetails;
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  // const productReviewCreate = useSelector((state) => state.productReviewCreate);
  // const {
  //   loading: loadingCreateReview,
  //   error: errorCreateReview,
  //   success: successCreateReview,
  // } = productReviewCreate;

  // useEffect(() => {
  //   if (successCreateReview) {
  //     alert("Review Submitted");
  //     setRating(0);
  //     setComment("");
  //     // dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
  //   }
  //   // dispatch(listProductDetails(productId));
  // }, [dispatch, productId, successCreateReview]);

  const [createCart, { isLoading: LoadingcreateCart }] =
    useCreateCartMutation();

  const onCreateCart = async () => {
    const res = await createCart({});
    //@ts-ignore
    const data = res?.data;

    if (data) {
      let cartStorage: any = localStorage.getItem(CART_STORAGE);
      let cartParse: any = cartStorage ? JSON.parse(cartStorage) : null;
      let cartItems: any = cartParse ? cartParse.cartItems : [];

      let hasItem = false;
      if (cartItems.length > 0) {
        cartItems.map((ca: any) => {
          if (ca._id === productId) {
            hasItem = true;
          }
        });
      }
      if (hasItem) {
        updateCart(data, cartItems);
      } else {
        createCart1(data, cartItems);
      }

      navigate(`/cart/${productId}?qty=${qty}`);
    } else {
    }
  };

  const updateCart = (data: any, cartItems: any) => {
    cartItems.map((ca: any) => {
      if (ca._id === productId) {
        ca.qty = +qty;
      }
    });
    localStorage.setItem(
      CART_STORAGE,
      JSON.stringify({
        id: data?._id,
        cartItems: [...cartItems],
      })
    );
  };

  const createCart1 = (data: any, cartItems: any) => {
    localStorage.setItem(
      CART_STORAGE,
      JSON.stringify({
        id: data?._id,
        cartItems: [
          ...cartItems,
          {
            ...dataFetch,
            qty: +qty,
          },
        ],
      })
    );
  };

  const AddToCartHandle = (e: any) => {
    e.preventDefault();
    onCreateCart();
  };
  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   // dispatch(
  //   //   createProductReview(productId, {
  //   //     rating,
  //   //     comment,
  //   //   })
  //   // );
  // };
  return (
    <>
      <div className="container single-product">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger" mess={JSON.stringify(error)} />
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image">
                  <img src={product?.image} alt={product?.name} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product?.name}</div>
                  </div>
                  <p>{product?.description}</p>

                  <div className="product-count col-lg-7 ">
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Price</h6>
                      <span>${product?.price}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Status</h6>
                      {product?.countInStock > 0 ? (
                        <span>In Stock</span>
                      ) : (
                        <span>unavailable</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Reviews</h6>
                      <Rating
                        value={product?.rating}
                        text={`${product?.numReviews} reviews`}
                      />
                    </div>
                    {product?.countInStock > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Quantity</h6>
                          <select
                            value={qty}
                            onChange={(e) => setQty(+e.target.value)}
                          >
                            {iterator.map((x: any, index: number) => (
                              <option key={index} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={AddToCartHandle}
                          className="round-black-btn"
                        >
                          {LoadingcreateCart ? <Loading /> : "Add To Cart"}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* RATING */}

            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">REVIEWS</h6>
                {/*                 {product?.reviews.length === 0 && (
                  <Message variant={"alert-info mt-3"
                                  mess="No Reviews"
                }></Message>
                )} */}
                {/*       {product?.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                  >
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <span>{moment(review.createdAt).calendar()}</span>
                    <div className="alert alert-info mt-3">
                      {review.comment}
                    </div>
                  </div>
                ))} */}
              </div>
              {/*         <div className="col-md-6">
                <h6>WRITE A CUSTOMER REVIEW</h6>
                <div className="my-4">
                  {loadingCreateReview && <Loading />}
                  {errorCreateReview && (
                    <Message variant="alert-danger">
                      {errorCreateReview}
                    </Message>
                  )}
                </div>
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-4">
                      <strong>Rating</strong>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    <div className="my-4">
                      <strong>Comment</strong>
                      <textarea
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={loadingCreateReview}
                        className="col-12 bg-black border-0 p-3 rounded text-white"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <Message variant={"alert-warning"}>
                      Please{" "}
                      <Link to="/login">
                        " <strong>Login</strong> "
                      </Link>{" "}
                      to write a review{" "}
                    </Message>
                  </div>
                )}
              </div> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleProduct;
