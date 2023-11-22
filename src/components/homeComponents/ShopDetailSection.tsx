import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { useGetPublishedProductsQuery } from "../../store/components/products/productsApi";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Pagination from "./Pagination";
import { PAGE_SIZE } from "../../utils/constants";
import { formatMoneyCurrency } from "../../utils/commonFunction";
import moment from "moment";

const ShopDetailSection = ({
  pagenumber,
  keyword,
  brand,
  shopId,
  productShop,
}: any) => {
  const navigate = useNavigate();
  const [dataFetched, setdataFetched] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [total, setTotal] = useState<any>(1);

  const [params, setParams] = useState<any>({
    page: pagenumber ?? 1,
    keyword: keyword ?? "",
    brand: brand ?? "",
    limit: PAGE_SIZE,
    order: "desc",
    orderBy: "createdAt",
  });

  useEffect(() => {
    setParams({
      ...params,
      page: pagenumber ?? 1,
      keyword: keyword ?? "",
      brand: brand ?? "",
    });
  }, [pagenumber, keyword, brand]);

  const {
    data: dataProducts,
    error,
    isSuccess,
    isLoading,
  } = useGetPublishedProductsQuery(
    {
      product_shop: shopId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataProducts?.metadata?.products);
      setTotal(dataProducts?.totalPages);
      setCurrentPage(dataProducts?.page);
    }
  }, [dataProducts]);
  console.log(productShop);
  return (
    <>
      <div className="container">
        <div className="section">
          <h1>{productShop?.productShopName}</h1>
          <h2>Join in: {moment(productShop?.createdAt).calendar()}</h2>

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
                    {dataFetched?.map((product: any) => (
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
                                className="shopBack__img"
                                src={product?.product_thumb}
                                alt={product?.product_name}
                              />
                              <div className="shopBack__shopName">
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
                              >
                                {product?.product_name}
                              </div>
                            </p>

                            <Rating
                              value={product?.rating}
                              text={`${product?.numReviews} reviews`}
                            />
                            <h3>
                              ${formatMoneyCurrency(product?.product_price)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
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
    </>
  );
};

export default ShopDetailSection;
