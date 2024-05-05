import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Rating from "../components/homeComponents/Rating";
import Message from "../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/LoadingError/Loading";
import moment from "moment";
import {
  calPerDiscount,
  formatMoney,
  getUrlParams,
  rawMarkup,
} from "../utils/commonFunction";
import {
  useCheckIsBuyerQuery,
  useCreateReviewProductMutation,
  useGetByProductQuery,
  useGetProductsDetailQuery,
} from "../store/components/products/productsApi";
import { useCreateCartMutation } from "../store/components/orders/ordersApi";
import { getProductsCart, getUserInfo } from "../store/selector/RootSelector";
import { openToast } from "../store/components/customDialog/toastSlice";
import DocumentTitle from "../components/DocumentTitle";

const BF1 = "===";
const BF2 = ";;;";

const SingleProduct = () => {
  const dispatch = useDispatch();
  const productsCart = useSelector(getProductsCart);
  const [rating, setRating] = useState<any>(0);
  const [comment, setComment] = useState<any>("");
  const navigate = useNavigate();

  const userInfo = useSelector(getUserInfo);
  const productId = getUrlParams("id");

  const [qty, setQty] = useState<any>(1);

  useEffect(() => {
    let cartItems_temp: any = productsCart || [];
    cartItems_temp?.map((item: any) => {
      if (productId === item?.product_id) setQty(item?.quantity);
    });
  }, [productsCart, productId]);

  const [product, setdataFetched] = useState<any>({});
  const [skus, setSkus] = useState<any>({});
  const [skuSelected, setSkuSelected] = useState<any>({});
  const [skuSelectedId, setSkuSelectedId] = useState<any>("");
  const [product_variants, setProduct_variants] = useState<any>([]);
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
      const __product = dataFetch?.metadata;

      const __skus = __product.skus;
      const final: any = {};
      __skus.map((sk: any) => {
        const sku_values = sk.sku_values;
        const stringValues = Object.keys(sku_values)
          .sort((aa: any, bb: any) =>
            aa.toLowerCase() < bb.toLowerCase() ? -1 : 1
          )
          .reduce((acc: any, kk: any) => {
            acc = acc + kk + BF1 + sku_values[kk] + BF2;
            return acc;
          }, "");
        final[stringValues] = sk._id + BF2 + sk.sku_price + BF2 + sk.sku_stock;
      });
      setdataFetched(__product);
      setProduct_variants(__product?.product_variants);
      setSkus(final);
      const __skusSort = [...__skus];
      __skusSort.sort((sk1: any, sk2: any) =>
        sk1.sku_price < sk2.sku_price ? -1 : 1
      );
      setSkuSelected(__skusSort[0]?.sku_values);
    }
  }, [dataFetch]);

  useEffect(() => {
    const keys = Object.keys(skuSelected);
    if (keys.length) {
      const stringValues = keys
        .sort((aa: any, bb: any) =>
          aa.toLowerCase() < bb.toLowerCase() ? -1 : 1
        )
        .reduce((acc: any, kk: any) => {
          acc = acc + kk + BF1 + skuSelected[kk] + BF2;
          return acc;
        }, "");
      if (Object.keys(skus).includes(stringValues)) {
        setSkuSelectedId(skus[stringValues]);
      } else {
        setSkuSelectedId("");
      }
    } else {
      setSkuSelectedId("");
    }
  }, [skuSelected]);

  const [dataReview1, setdataReview1] = useState<any>([]);

  const {
    data: dataReview,
    error: err,
    isSuccess: iss,
    isLoading: isl,
  } = useGetByProductQuery(
    {
      productId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (iss) {
      setdataReview1(dataReview?.metadata?.reviews);
    }
  }, [dataReview]);

  const [hasBuyer, sethasBuyer] = useState<any>(false);

  const {
    data: dataCheck,
    error: errorCheck,
    isSuccess: isSuccessCheck,
    isLoading: isLoadingCheck,
  } = useCheckIsBuyerQuery(
    {
      id: productId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessCheck) {
      sethasBuyer(dataCheck?.metadata);
    }
  }, [dataCheck]);

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
          content: "Added Cart Success",
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

  const AddToCartHandle = (e: any) => {
    e.preventDefault();
    if (skuSelectedId) {
      // console.log({
      //   product: {
      //     cart_shopId: product?.product_shop,
      //     product_id: product?._id,
      //     sku_id: skuSelectedId.split(BF2)[0],
      //     quantity: +qty,
      //     price: product?.product_price,
      //     name: product?.product_name,
      //     image: product?.product_thumb,
      //   },
      // })
      const sku_id = skuSelectedId.split(BF2)[0];

      const foundSku = product?.skus.find((item: any) => item?._id === sku_id);
      if (!foundSku || foundSku?.isDraft || !foundSku?.isPublished) {
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: `The Option has been Discontinued !!`,
            step: 2,
          })
        );
        return;
      }

      if (product?.isDraft || !product?.isPublished) {
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: `The Product has been Discontinued !!`,
            step: 2,
          })
        );
        return;
      }

      onCreateCart({
        product: {
          cart_shopId: product?.product_shop,
          product_id: product?._id,
          sku_id,
          quantity: +qty,
          price: product?.product_price,
          name: product?.product_name,
          image: product?.product_thumb,
        },
      });
    }
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
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Created Review Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Create Review Failed",
          step: 2,
        })
      );
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onCreateReviewProduct({
      rating: +rating,
      comment: comment,
      productId: productId,
      shopId: product?.product_shop,
    });
  };

  const sliceString = (string: any) => {
    return string.slice(0, 2) + "***";
  };

  const productRender: any = {};

  if (skuSelectedId) {
    if (Object.keys(product).length) {
      const sku_id = skuSelectedId.split(BF2)[0];
      const foundSku = product?.skus.find((item: any) => item?._id === sku_id);

      const { sku_stock = 0, sku_price = 0, sku_sold = 0 } = foundSku;

      const {
        product_original_price = 0,
        product_sold = 0,
        product_price = 0,
        product_quantity = 0,
      } = product;

      productRender.product_original_price = +product_original_price;
      productRender.product_price = +(sku_price ?? product_price);
      productRender.product_quantity = +(sku_stock ?? product_quantity);
      productRender.sku_sold = sku_sold ?? product_sold;

      if (product?.isDraft || !product?.isPublished)
        productRender.product_quantity = 0;

      if (!foundSku || foundSku?.isDraft || !foundSku?.isPublished)
        productRender.product_quantity = 0;
    }
  }

  return (
    <>
      <DocumentTitle title={"Product Detail"}></DocumentTitle>

      <div className="container single-product">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger" mess={error} />
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image">
                  <img
                    loading="lazy"
                    src={product?.product_thumb}
                    alt="product_thumb"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                <div className="product-info">
                    <div className="product-name">{product?.product_name}</div>
                  </div>
                  <div className="product-count col-lg-7 ">
                    {product_variants.map((ppp: any, index: number) => {
                      const { values = [] } = ppp;
                      return (
                        <div
                          key={index}
                          className="flex-box d-flex justify-content-between align-items-center"
                        >
                          {/* <h6>{ppp.name}</h6> */}
                          {values.map((vvv: any, index: number) => {
                            return (
                              <span
                                className={
                                  skuSelected[ppp?.name] === vvv
                                    ? "active__value pr8px pl8px"
                                    : "pr8px pl8px cursor__pointer"
                                }
                                key={index}
                                onClick={() => {
                                  const final: any = {};
                                  final[ppp?.name] = vvv;
                                  setSkuSelected((prev: any) => ({
                                    ...prev,
                                    ...final,
                                  }));
                                }}
                              >
                                {vvv}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}

                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Price</h6>
                      <span className="line__through">
                        ${productRender?.product_original_price}
                      </span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Sale Price</h6>
                      <span className="ed1c24">
                        - {calPerDiscount(productRender)} %
                      </span>
                      <span>${productRender?.product_price}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6 className="color__00ba9d">Available</h6>
                      <span className="color__00ba9d">
                        {formatMoney(productRender.product_quantity) || 0}
                      </span>
                    </div>

                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6 className="color__035ecf">Already sold</h6>
                      <span className="color__035ecf">
                        {formatMoney(productRender.sku_sold) || 0}
                      </span>
                    </div>

                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Reviews</h6>
                      <Rating
                        value={product?.product_ratings ?? 5}
                        text={`${product?.numReviews ?? 0} reviews`}
                      />
                    </div>
                    {1 ? (
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
                    <div className="mt24px">
                    <div
                    dangerouslySetInnerHTML={rawMarkup(
                      product?.product_description
                    )}
                  ></div>
                    </div>

                </div>
              </div>
            </div>

            {/* RATING */}

            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">REVIEWS</h6>
                {dataReview1?.length === 0 ? (
                  <Message
                    variant="alert-info mt-3"
                    messText="No Reviews"
                  ></Message>
                ) : (
                  dataReview1?.map((review: any) => (
                    <div
                      key={review?._id}
                      className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                    >
                      <Rating value={review?.rating ?? 5} />
                      <p>
                        Created by:
                        <strong>{sliceString(review?.userId?.name)}</strong>
                      </p>
                      <span>{moment(review?.createdAt).calendar()}</span>
                      <div className="alert alert-info mt-3 pre-wrap">
                        {/* {review?.comment} */}
                        <div
                          dangerouslySetInnerHTML={rawMarkup(review?.comment)}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="col-md-6">
                <h6>WRITE A CUSTOMER REVIEW </h6>
                {/* <h6>( IF YOU HAVE MADE A PURCHASE ) </h6> */}
                <div className="my-4">
                  {LoadingcreateReview && <Loading />}
                  {errorcreateReview && (
                    <Message
                      variant="alert-danger"
                      mess={errorcreateReview}
                    ></Message>
                  )}
                </div>
                {userInfo?.name ? (
                  hasBuyer ? (
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
                    <></>
                  )
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
