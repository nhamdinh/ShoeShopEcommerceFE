import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../store/components/auth/authApi";
import { NAME_STORAGE } from "../utils/constants";
import { setUserInfo, userLogout } from "../store/components/auth/authSlice";

const Header = () => {
  const [keyword, setKeyword] = useState<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = [];
  const cartItems = [];
  const userLogin = true;

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  const [userInfo, setdataFetched] = useState<any>({});

  const { data, error, isSuccess, isLoading } = useGetProfileQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      console.log("Header Header Header")
      setdataFetched(data);
      dispatch(setUserInfo({ ...data }));
      localStorage.setItem(NAME_STORAGE, data.name);
    }
  }, [data]);

  const logoutHandler = () => {
    setdataFetched({});
    dispatch(userLogout());
  };
  // console.log(data);
  return (
    <div className="header">
      <div className="container">
        <div className="mobile-header">
          <div className="container ">
            <div className="row ">
              <div className="col-6 d-flex align-items-center">
                <Link className="navbar-brand" to="/">
                  <img alt="logo" src="/images/logo.png" />
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
              <div className="col-12 d-flex align-items-center">
                <form onSubmit={submitHandler} className="input-group">
                  <input
                    type="search"
                    className="form-control rounded search"
                    placeholder="Search"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="pc-header">
          <div className="row">
            <div className="col-md-3 col-4 d-flex align-items-center">
              <Link className="navbar-brand" to="/">
                <img alt="logo" src="/images/logo.png" />
              </Link>
            </div>
            <div className="col-md-6 col-8 d-flex align-items-center">
              <form onSubmit={submitHandler} className="input-group">
                <input
                  type="search"
                  className="form-control rounded search"
                  placeholder="Search"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">
                  search
                </button>
              </form>
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
