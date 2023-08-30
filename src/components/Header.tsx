import "./style.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../store/components/auth/authApi";
import { NAME_STORAGE } from "../utils/constants";
import { setUserInfo, userLogout } from "../store/components/auth/authSlice";
import { useCheckCartQuery } from "../store/components/orders/ordersApi";
import {
  setStoCart,
  setStoProducts,
} from "../store/components/products/productsSlice";
import { useGetProductsQuery } from "../store/components/products/productsApi";
import { getDataProducts } from "../store/selector/RootSelector";

const Header = () => {
  const [keyword, setKeyword] = useState<any>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataProducts1 = useSelector(getDataProducts);
  const [dataProducts, setdataProducts] = useState<any>([]);
  const [dropdown, setdropdown] = useState<any>(false);
  const {
    data: dataFetch,
    error: errdataProducts,
    isSuccess: isSuccessdataProducts,
    isLoading: isLoadingdataProducts,
  } = useGetProductsQuery(
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
      dispatch(setStoProducts(dataFetch?.products));
      setdataProducts(dataFetch?.products);
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
      setcartItems(dataCart?.cartItems || []);
      dispatch(setStoCart({ ...dataCart }));
    }
  }, [dataCart]);

  const submitHandler = (value: any) => {
    setKeyword(value);
    if (value.trim()) {
      navigate(`/?search=${value}`);
    } else {
      navigate("/");
    }
  };
  const [userInfo, setdataFetched] = useState<any>({});

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
      setdataFetched(dataProfile);
      dispatch(setUserInfo({ ...dataProfile }));
      localStorage.setItem(NAME_STORAGE, dataProfile.name);
    }
  }, [dataProfile]);

  const logoutHandler = () => {
    setdataFetched({});
    dispatch(userLogout());
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
                <Link className="navbar-brand" to="/">
                  <img
                    alt="logo"
                    src="https://w.ladicdn.com/5bf3dc7edc60303c34e4991f/logo-02-20200903083638.svg"
                  />
                </Link>
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
              <div className="col-12 d-flex align-items-center zxc">
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
                  />
                  <button
                    type="submit"
                    onClick={() => {
                      setdropdown(false);
                      submitHandler(keyword);
                    }}
                    className="search-button"
                  >
                    search
                  </button>
                </div>
                {dropdown && (
                  <div className="search-container">
                    <div className="dropdown">
                      {dataProducts1
                        .filter((item: any) => {
                          const searchTerm = keyword.toLowerCase();
                          const fullName = item?.name.toLowerCase();

                          return (
                            searchTerm &&
                            fullName.includes(searchTerm) &&
                            fullName !== searchTerm
                          );
                        })
                        .slice(0, 10)
                        .map((item: any) => (
                          <div
                            className="dropdown-row"
                            onClick={(e) => {
                              e.stopPropagation();
                              submitHandler(item?.name);
                            }}
                            key={item?.name}
                          >
                            {item?.name}
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
              <Link className="navbar-brand" to="/">
                <img
                  alt="logo"
                  src="https://w.ladicdn.com/5bf3dc7edc60303c34e4991f/logo-02-20200903083638.svg"
                />
              </Link>
            </div>
            <div className="col-md-6 col-8 d-flex align-items-center zxc">
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
                />
                <button
                  type="submit"
                  onClick={() => {
                    setdropdown(false);
                    submitHandler(keyword);
                  }}
                  className="search-button"
                >
                  search
                </button>
              </div>
              {dropdown && (
                <div className="search-container">
                  <div className="dropdown">
                    {dataProducts1
                      .filter((item: any) => {
                        const searchTerm = keyword.toLowerCase();
                        const fullName = item?.name.toLowerCase();
                        // console.log(searchTerm);
                        // console.log(fullName);
                        return (
                          searchTerm &&
                          fullName.includes(searchTerm) &&
                          fullName !== searchTerm
                        );
                      })
                      .slice(0, 10)
                      .map((item: any, index: number) => (
                        <div
                          className="dropdown-row"
                          onClick={(e) => {
                            e.stopPropagation();
                            submitHandler(item?.name);
                          }}
                          key={item?.name}
                        >
                          <div className="name">{item?.name}</div>
                          <img src={item?.image} alt="" />
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
