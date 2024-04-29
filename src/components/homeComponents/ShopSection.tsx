import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { useGetProductsQuery } from "../../store/components/products/productsApi";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Pagination from "./Pagination";
import {
  PAGE_SIZE,
  ORDER_SORT_OPTIONS,
  PRODUCT_CATEGORIES_REAL,
} from "../../utils/constants";
import {
  calPerDiscount,
  formatMoneyCurrency,
  removeNullObject,
} from "../../utils/commonFunction";
import { Carousel, Col, Modal, Row, Select } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import SelectApp from "../../ui/SelectApp";

const ShopSection = ({ pagenumber, keyword, brand }: any) => {
  const navigate = useNavigate();
  const [dataFetched, setdataFetched] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [total, setTotal] = useState<any>(1);

  const options = ORDER_SORT_OPTIONS.filter((option) => option);
  const [sort, setSort] = useState<any>(options[0].value);
  const optionsCate: any = PRODUCT_CATEGORIES_REAL.filter((option) => option);
  const [category, setCategory] = useState<any>(optionsCate[0].value);

  const [params, setParams] = useState<any>({
    page: pagenumber ?? 1,
    limit: PAGE_SIZE,
    orderByValue: -1,
    orderByKey: "_id",
    product_type: "",
    keyword: keyword ?? "",
    brand: brand ?? "",
  });

  useEffect(() => {
    const final: any = {};
    PRODUCT_CATEGORIES_REAL.map((opt) => {
      if (opt.value === category) {
        final.product_type = opt.product_type ?? "";
      }
    });
    setParams((prev: any) => ({
      ...prev,
      ...final,
    }));
  }, [category]);

  useEffect(() => {
    const final: any = {};
    ORDER_SORT_OPTIONS.map((opt) => {
      if (opt.value === sort) {
        final.orderByKey = opt.orderByKey ?? "_id";
        final.orderByValue = opt.orderByValue ?? -1;
      }
    });
    setParams((prev: any) => ({
      ...prev,
      ...final,
    }));
  }, [sort]);

  useEffect(() => {
    setParams((prev: any) => ({
      ...prev,
      page: +(pagenumber ?? 1),
      keyword: keyword ?? "",
      brand: brand ?? "",
    }));
  }, [pagenumber, keyword, brand]);

  const {
    data: dataProducts,
    error,
    isSuccess,
    isLoading,
  } = useGetProductsQuery(removeNullObject(params), {
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataProducts?.metadata?.products);
      setTotal(dataProducts?.metadata?.totalPages);
      setCurrentPage(dataProducts?.metadata?.page);
    }
  }, [dataProducts]);

  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="row mb40px">
                <div className=" col-lg-6 col-md-6 col-sm-6"></div>
                <div className=" col-lg-6 col-md-6 col-sm-6">
                  <div className="row gap12px flex__content__end">
                    {/* <div className=" col-lg-5 col-md-12 col-sm-12 flex__content__end">
                      <SelectApp
                        options={optionsCate}
                        value={category}
                        cb_setValue={(value: any, opt: any) => {
                          setCategory(value);
                        }}
                      />
                    </div> */}
                    <div className=" col-lg-5 col-md-12 col-sm-12 flex__content__end">
                      <SelectApp
                        options={options}
                        value={sort}
                        cb_setValue={(value: any, opt: any) => {
                          setSort(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                        className="mb50px col-lg-4 col-md-6 col-sm-6"
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
                                src={
                                  product?.product_thumb_small ??
                                  product?.product_thumb
                                }
                                alt={product?.product_name}
                              />
                              <div
                                className="shopBack__shopName capitalize gradient__shopee"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/shop/${product?.product_shop?._id}`
                                  );
                                }}
                              >
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

                            <div className="df content__between">
                              <h3 className="line__through">
                                $
                                {formatMoneyCurrency(
                                  product?.product_original_price
                                )}
                              </h3>
                              <h3 className="ed1c24">
                                - {calPerDiscount(product)} %
                              </h3>
                            </div>
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

export default ShopSection;
