import "./style.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useLogoutMutation,
} from "../store/components/auth/authApi";
import { NAME_STORAGE } from "../utils/constants";
import { setUserInfo, userLogout } from "../store/components/auth/authSlice";
import { useCheckCartQuery } from "../store/components/orders/ordersApi";
import {
  setStProductsCart,
  setStoProducts,
} from "../store/components/products/productsSlice";
import {
  useCreateCoMutation,
  useGetBrandsQuery,
  useGetCoQuery,
  useGetProductsMaxQuery,
} from "../store/components/products/productsApi";
import { getDataProducts, getUserInfo } from "../store/selector/RootSelector";
import mainLogo from "./../images/logo_light.svg";

import axios from "axios";
import { toNonAccentVietnamese } from "../utils/commonFunction";

const Header = () => {
  const [keyword, setKeyword] = useState<any>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [
    createCo,
    { isLoading: LoadingcreateReview, error: errorcreateReview },
  ] = useCreateCoMutation();

  const onCreateReviewProduct = async (values: any) => {
    const res = await createCo({});
    //@ts-ignore
    const data = res?.data;
    console.log(data);
    if (data) {
    } else {
    }
  };

  let axiosConfig = {
    withCredentials: true,
    credentials: "include",
  };

  const loginUser = async (data: any) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cookie`,
        axiosConfig
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: datacookie,
    error: errBrandsx,
    isSuccess: isSuccessBrandsx,
    isLoading: isLoadingBrandsx,
  } = useGetCoQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  // console.log(datacookie);

  const [brand, setbrand] = useState<any>("All");
  const [brands, setbrands] = useState<any>([]);
  const {
    data: databrands,
    error: errBrands,
    isSuccess: isSuccessBrands,
    isLoading: isLoadingBrands,
  } = useGetBrandsQuery(
    {
      page: 1,
      limit: 1000,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccessBrands) {
      const dataBrands = databrands?.metadata.brands;
      const __dataBrands = dataBrands.map((mm: any) => {
        return {
          value: mm._id,
          label: mm.brand,
        };
      });
      setbrands(__dataBrands);
    }
  }, [databrands]);

  const [dropdown, setdropdown] = useState<any>(false);
  const dataProducts1 = useSelector(getDataProducts);
  const [dataProducts, setdataProducts] = useState<any>([]);

  const dataProductsFilter = () => {
    return dataProducts1
      .filter((item: any) => {
        const searchTerm = toNonAccentVietnamese(keyword.toLowerCase());
        const fullName = toNonAccentVietnamese(
          item?.product_name.toLowerCase()
        );
        return (
          searchTerm && fullName.includes(searchTerm) && fullName !== searchTerm
        );
      })
      .slice(0, 10);
  };
  const {
    data: dataFetch,
    error: errdataProducts,
    isSuccess: isSuccessdataProducts,
    isLoading: isLoadingdataProducts,
  } = useGetProductsMaxQuery(
    {
      page: 1,
      limit: 1000,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessdataProducts) {
      dispatch(setStoProducts(dataFetch?.metadata?.products));
      setdataProducts(dataFetch?.metadata?.products);
    }
  }, [dataFetch]);

  const [cartItems, setcartItems] = useState<any>([]);
  const { data: dataCart, isSuccess: isSuccessCart } = useCheckCartQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessCart) {
      const productsCart = dataCart?.metadata.flatMap(
        (cart: any) => cart.cart_products
      );

      setcartItems(productsCart || []);
      dispatch(setStProductsCart(productsCart));
    }
  }, [dataCart]);

  const submitHandler = (value: any, bra: any) => {
    setKeyword(value);
    if (value.trim() || bra) {
      navigate(`/?search=${value.trim()}&&brand=${bra}`);
    } else {
      navigate("/");
    }
  };
  // const [userInfo, setdataFetched] = useState<any>({});
  const userInfo = useSelector(getUserInfo);

  const {
    data: dataProfile,
    error,
    isSuccess: isSuccessProfile,
    isLoading,
  } = useGetProfileQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessProfile) {
      // setdataFetched(dataProfile?.metadata);
      dispatch(setUserInfo({ ...dataProfile?.metadata }));
      localStorage.setItem(NAME_STORAGE, dataProfile?.metadata?.name);
    }
  }, [dataProfile]);

  useEffect(() => {
    // console.log(error);
  }, [error]);

  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    // await logout({});
    // setdataFetched({});
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <div className="header">
      <div className="container">
        <div
          className="mobile-header"
          tabIndex={0}
          onBlur={(e) => {
            e.stopPropagation();
            // setdropdown(false);
          }}
        >
          <div className="container ">
            <div className="row ">
              <div className="col-6 d-flex align-items-center">
                <Link className=" df items__center navbar-brand" to="/">
                  <img src={mainLogo} alt="ShopNode" />
                </Link>
                {/* <button onClick={loginUser}>zzzzz</button> */}
              </div>
              <div className="col-6 d-flex align-items-center justify-content-end Login-Register">
                {userInfo?.name ? (
                  <div className="btn-group">
                    <button
                      type="button"
                      className="name-button dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-user"></i>
                    </button>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>

                      <a className="dropdown-item" onClick={logoutHandler}>
                        Logout
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="btn-group">
                    <button
                      type="button"
                      className="name-button dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-user"></i>
                    </button>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>

                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                <Link to="/cart" className="cart-mobile-icon">
                  <i className="fas fa-shopping-bag"></i>
                  <span className="badge">{cartItems.length}</span>
                </Link>
              </div>
              <div className="col-12 d-flex align-items-center column position__relative">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control rounded search"
                    placeholder="Search"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setdropdown(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        submitHandler(keyword, brand);
                        setdropdown(false);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    onClick={() => {
                      setdropdown(false);
                      submitHandler(keyword, brand);
                    }}
                    className="search-button"
                  >
                    search
                  </button>
{/* 
                  <select
                    className="search-button capitalize"
                    value={brand}
                    onChange={(e) => {
                      console.log(e.target.value);

                      setbrand(e.target.value);
                      submitHandler(keyword, e.target.value);
                    }}
                  >
                    <option className="option__br">All</option>

                    {brands.map((bra: any, index: number) => {
                      return (
                        <option
                          className="option__br"
                          key={index}
                          value={bra?.value}
                        >
                          {bra?.label}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
                {dropdown && (
                  <div className="search-container">
                    <div className="dropdown">
                      {dataProductsFilter().map((item: any) => (
                        <div
                          className="dropdown-row"
                          onClick={(e) => {
                            e.stopPropagation();
                            // submitHandler(item?.name, brand);

                            navigate(`product-detail?id=${item?._id}`);
                            setKeyword("");
                          }}
                          key={item?._id}
                        >
                          {item?.product_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="pc-header"
          tabIndex={1}
          onBlur={(e) => {
            e.stopPropagation();

            // setdropdown(false);
          }}
        >
          <div className="row">
            <div className="col-md-3 col-4 d-flex align-items-center">
              <Link className=" df items__center navbar-brand" to="/">
                <img src={mainLogo} alt="ShopNode" />
                <h4 className="brand__Shop shadow__orangered">ShopNode</h4>
              </Link>
              {/* <button onClick={loginUser}>zzzzz</button> */}
            </div>
            <div className="col-md-6 col-8 d-flex align-items-center column content__center position__relative">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control rounded search"
                  placeholder="Search"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setdropdown(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      submitHandler(keyword, brand);
                      setdropdown(false);
                    }
                  }}
                />
                <button
                  type="submit"
                  onClick={() => {
                    setdropdown(false);
                    submitHandler(keyword, brand);
                  }}
                  className="search-button"
                >
                  search
                </button>
{/*                 <select
                  className="search-button capitalize"
                  value={brand}
                  onChange={(e) => {
                    setbrand(e.target.value);
                    submitHandler(keyword, e.target.value);
                  }}
                >
                  <option className="option__br">All</option>

                  {brands.map((bra: any, index: number) => {
                    return (
                      <option
                        className="option__br"
                        key={index}
                        value={bra?.value}
                      >
                        {bra?.label}
                      </option>
                    );
                  })}
                </select> */}
              </div>
              {dropdown && (
                <div className="search-container">
                  <div className="dropdown">
                    {dataProductsFilter().map((item: any, index: number) => (
                      <div
                        className="dropdown-row"
                        onClick={(e) => {
                          e.stopPropagation();
                          // submitHandler(item?.name, brand);
                          navigate(`product-detail?id=${item?._id}`);
                          setKeyword("");
                        }}
                        key={item?._id}
                      >
                        <div className="name">{item?.product_name}</div>
                        <img src={item?.product_thumb} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-3 d-flex align-items-center justify-content-end Login-Register">
              {userInfo?.name ? (
                <div className="btn-group">
                  <button
                    type="button"
                    className="name-button dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Hi, {userInfo?.name}
                  </button>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>

                    <a className="dropdown-item" onClick={logoutHandler}>
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
                </>
              )}

              <Link to="/cart">
                <i className="fas fa-shopping-bag"></i>
                <span className="badge">{cartItems.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
