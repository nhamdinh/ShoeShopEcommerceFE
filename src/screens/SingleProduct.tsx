import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Rating from "../components/homeComponents/Rating";
import Message from "../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Loading from "../components/LoadingError/Loading";
import moment from "moment";
import { getUrlParams } from "../utils/commonFunction";
import {
  useCreateReviewProductMutation,
  useGetProductsDetailQuery,
} from "../store/components/products/productsApi";
import { useCreateCartMutation } from "../store/components/orders/ordersApi";
import { getUserInfo } from "../store/selector/RootSelector";
import Toast from "../components/LoadingError/Toast";
import { toast } from "react-toastify";
import { Toastobjects } from "../utils/constants";

const SingleProduct = ({ history, match }: any) => {
  const [rating, setRating] = useState<any>(0);
  const [comment, setComment] = useState<any>("");
  const navigate = useNavigate();

  const userInfo = useSelector(getUserInfo);
  const productId = getUrlParams("id");

  const [qty, setQty] = useState<any>(1);
  
  const [product, setdataFetched] = useState<any>({});

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

  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataFetch);
    }
  }, [dataFetch]);

  //@ts-ignore
  const [iterator, setiterator] = useState<any>([...Array(10).keys()]);

  const [createCart, { isLoading: LoadingcreateCart }] =
    useCreateCartMutation();

  const onCreateCart = async (value: any) => {
    const res = await createCart(value);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      navigate(`/cart/${productId}?qty=${qty}`);
    } else {
    }
  };

  const AddToCartHandle = (e: any) => {
    e.preventDefault();
    onCreateCart({
      cartItems: [
        {
          name: product?.name,
          image: product?.image,
          price: product?.price,
          qty: qty,
          product: productId,
        },
      ],
    });
  };

  const [
    createReviewProduct,
    { isLoading: LoadingcreateReview, error: errorcreateReview },
  ] = useCreateReviewProductMutation();

  const onCreateReviewProduct = async (values: any) => {
    const res = await createReviewProduct(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      toast.success(data?.message, Toastobjects);
    } else {
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onCreateReviewProduct({
      rating: rating,
      comment: comment,
      productId: productId,
    });
  };

  return (
    <>
      <Toast />
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
                {product?.reviews?.length === 0 ? (
                  <Message
                    variant="alert-info mt-3"
                    mess="No Reviews"
                  ></Message>
                ) : (
                  product?.reviews?.map((review: any) => (
                    <div
                      key={review?._id}
                      className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                    >
                      <strong>{review?.name}</strong>
                      <Rating value={review?.rating} />
                      <span>{moment(review?.createdAt).calendar()}</span>
                      <div className="alert alert-info mt-3">
                        {review?.comment}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="col-md-6">
                <h6>WRITE A CUSTOMER REVIEW</h6>
                <div className="my-4">
                  {LoadingcreateReview && <Loading />}
                  {errorcreateReview && (
                    <Message
                      variant="alert-danger"
                      mess={JSON.stringify(errorcreateReview)}
                    ></Message>
                  )}
                </div>
                {userInfo?.name ? (
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
                        maxLength={255}
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={LoadingcreateReview}
                        className="col-12 bg-black border-0 p-3 rounded text-white"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <div>
                      Please{" "}
                      <Link to="/login">
                        " <strong>Login</strong> "
                      </Link>{" "}
                      to write a review{" "}
                    </div>
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

export default SingleProduct;
