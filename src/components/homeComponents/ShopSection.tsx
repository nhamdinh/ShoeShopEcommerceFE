import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { useGetProductsQuery } from "../../store/components/products/productsApi";
import Loading from "../LoadingError/Loading";

const ShopSection = ({ pagenumber, keyword }: any) => {
  const navigate = useNavigate();

  const { data, error, isSuccess, isLoading } = useGetProductsQuery(
    {
      page: 1,
      limit: 100,
      order: "desc",
      orderBy: "createdAt",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
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
                  <></>
                ) : (
                  /*                   <Message variant="alert-danger" mess={error.error}></Message>
                   */ <>
                    {data?.products.map((product: any) => (
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
                )}
                {/* Pagination */}
                {/*  <Pagination
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ""}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
