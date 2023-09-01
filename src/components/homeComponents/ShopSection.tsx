import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { useGetProductsQuery } from "../../store/components/products/productsApi";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Pagination from "./Pagination";
import { PAGE_SIZE } from "../../utils/constants";

const ShopSection = ({ pagenumber, keyword, brand }: any) => {
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
  } = useGetProductsQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataProducts?.products);
      setTotal(dataProducts?.totalPages);
      setCurrentPage(dataProducts?.page);
    }
  }, [dataProducts]);

  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">
                {isLoading ? (
                  <div className="mb-5">
                    <Loading />
                  </div>
                ) : error ? (
                  <Message
                    variant="alert-danger"
                    mess={JSON.stringify(error)}
                  />
                ) : dataFetched?.length > 0 ? (
                  <>
                    {dataFetched?.map((product: any) => (
                      <div
                        className="shop col-lg-4 col-md-6 col-sm-6"
                        key={product._id}
                      >
                        <div className="border-product">
                          <div
                            onClick={() => {
                              navigate(`/product-detail?id=${product._id}`);
                            }}
                          >
                            <div className="shopBack">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </div>

                          <div className="shoptext">
                            <p>
                              <div
                                onClick={() => {
                                  navigate(`/product-detail?id=${product._id}`);
                                }}
                              >
                                {product.name}
                              </div>
                            </p>

                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                            />
                            <h3>${product.price}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <Message variant="alert-danger" mess="Product Not Found" />
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
