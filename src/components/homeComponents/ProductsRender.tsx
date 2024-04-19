import "./styles.scss";
import { useNavigate } from "react-router-dom";
import Rating from "./Rating";
import {
  useDeleteProductMutation,
  usePublishProductMutation,
} from "../../store/components/products/productsApi";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Pagination from "./Pagination";
import {
  formatCustomerPhoneNumber,
  formatMoneyCurrency,
} from "../../utils/commonFunction";
import moment from "moment";
import { useDispatch } from "react-redux";
import { openDialog } from "../../store/components/customDialog/dialogSlice";
import { openToast } from "../../store/components/customDialog/toastSlice";
import ChatBox from "../ChatBox";

const ProductsRender = ({
  isLoading,
  keyword,
  brand,
  error,
  productShop,
  dataFetched,
  userInfo,
  total,
  currentPage,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteProduct, { isLoading: ill, error: err }] =
    useDeleteProductMutation();

  const onDeleteProduct = async (values: any) => {
    const res = await deleteProduct(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "To Draft Product Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "To Draft Product Failed",
          step: 2,
        })
      );
    }
  };
  const [publishProduct, { isLoading: illz, error: errz }] =
    usePublishProductMutation();

  const onPublishProduct = async (values: any) => {
    const res = await publishProduct(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "To Publish Product Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "To Publish Product Failed",
          step: 2,
        })
      );
    }
  };

  const deleteHandler = (id: any) => {
    dispatch(
      openDialog({
        type: "confirm",
        title: "Are you sure to draft??",
        actionConfirm: () => {
          onDeleteProduct({
            productId: id,
          });
        },
        actionAfterClose: () => {},
      })
    );
  };
  return (
    <div className="container">
      <div className="section">
        <div className="STORE">
        STORE: <h1 className="capitalize mr50px"> {productShop?.productShopName}</h1> {productShop?.email !== userInfo?.email && <ChatBox productShop={productShop}></ChatBox>}
        </div>
        <h3>Phone: {formatCustomerPhoneNumber(productShop?.phone)}</h3>
        <h3>Join in: {moment(productShop?.createdAt).calendar()}</h3>

        <div className="row">
          <div className="col-lg-12 col-md-12 article">
            <div className="shopcontainer row">
              {isLoading ? (
                <div className="mb-5">
                  <Loading />
                </div>
              ) : error ? (
                <Message variant="alert-danger" mess={error} />
              ) : dataFetched?.length > 0 ? (
                <>
                  {dataFetched?.map((product: any) => {
                    return (
                      <div
                        className="shop col-lg-4 col-md-6 col-sm-6"
                        key={product?._id}
                      >
                        <div className="border-product">
                          <div
                            onClick={() => {
                              navigate(`/product-detail?id=${product?._id}`);
                            }}
                          >
                            <div className="shopBack">
                              <img
                                className="scale shopBack__img cursor__pointer"
                                loading="lazy"
                                src={product?.product_thumb_small ?? product?.product_thumb}
                                alt={product?.product_name}
                              />
                              <div className="shopBack__shopName capitalize">
                                {product?.product_shop?.productShopName}
                              </div>
                            </div>
                          </div>

                          <div className="shoptext">
                            <p>
                              <div
                                onClick={() => {
                                  navigate(
                                    `/product-detail?id=${product?._id}`
                                  );
                                }}
                                className="line__clamp__2 h54px"
                              >
                                {product?.product_name}
                              </div>
                            </p>

                            <Rating
                              value={product?.product_ratings ?? 5}
                              text={`${product?.numReviews ?? 0} reviews`}
                            />
                            <h3>
                              ${formatMoneyCurrency(product?.product_price)}
                            </h3>
                          </div>
                        </div>
                        {product?.product_shop?.email === userInfo?.email && (
                          <div className="update__product mt20px">
                            <div
                              className="btn btn-warning"
                              onClick={() => {
                                navigate(`/product/${product?._id}/edit`);
                              }}
                            >
                              edit
                            </div>
                            {product?.isPublished ? (
                              <div
                                className="btn btn-dark"
                                onClick={() => deleteHandler(product?._id)}
                              >
                                to draft
                              </div>
                            ) : (
                              <div
                                className="btn btn-info"
                                onClick={() =>
                                  onPublishProduct({
                                    productId: product?._id,
                                  })
                                }
                              >
                                to Published
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <Message variant="alert-danger" messText="No Products" />
              )}
              {/* Pagination */}
              <Pagination
                total={total}
                page={currentPage}
                keyword={keyword ?? ""}
                brand={brand ?? ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsRender;
