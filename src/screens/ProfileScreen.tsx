import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ProfileTabs from "../components/profileComponents/ProfileTabs";
import { getUserInfo } from "../store/selector/RootSelector";
import Orders from "../components/profileComponents/Orders";
import { formatCustomerPhoneNumber } from "../utils/commonFunction";
import SellerTabs from "../components/profileComponents/SellerTabs";
import AddProductMain from "../components/ProductsShop/AddProductMain";
import mainLogo3 from "./../images/user.png";
import DraftProducts from "../components/ProductsShop/DraftProducts";
import CreateCoupon from "../components/Coupons/CreateCoupon";
import ListCoupons from "../components/Coupons/ListCoupons";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [tab, setTab] = useState<any>(1);

  const userInfo = useSelector(getUserInfo);
  const [isShop, setisShop] = useState<any>(userInfo.isShop);

  useEffect(() => {
    setisShop(userInfo.isShop);
  }, [userInfo]);

  return (
    <div className="container mt-lg-5 mt-3">
      <div className="row align-items-start">
        <div className="col-lg-4 p-0 shadow ">
          <div className="author-card pb-0 pb-md-3">
            <div className="author-card-cover"></div>
            <div className="author-card-profile row">
              <div className="author-card-avatar col-md-5">
                <img src={mainLogo3} alt="userprofileimage" />
              </div>
              <div className="author-card-details col-md-7">
                <h5 className="author-card-name mb-2">
                  <strong>{userInfo?.name}</strong> <br />
                  <strong>{formatCustomerPhoneNumber(userInfo?.phone)}</strong>
                </h5>
                <span className="author-card-position">
                  <>Joined {moment(userInfo?.createdAt).format("LL")}</>
                </span>
              </div>
            </div>
          </div>
          <div className="wizard pt-3 ">
            <div className="d-flex align-items-start">
              <div
                className="nav align-items-start flex-column col-12 nav-pills me-3 "
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <button
                  className="nav-link active"
                  id="v-pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-home"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                  onClick={() => {
                    setTab(1);
                  }}
                >
                  Profile Settings
                </button>
                <button
                  className="nav-link d-flex justify-content-between"
                  id="v-pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-profile"
                  aria-selected="false"
                  onClick={() => {
                    navigate("/shipping")
                  }}
                >
                  shipping address
                  {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                </button>
                <button
                  className="nav-link d-flex justify-content-between"
                  id="v-pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-profile"
                  aria-selected="false"
                  onClick={() => {
                    setTab(2);
                  }}
                >
                  Orders List
                  {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                </button>
                {!isShop && (
                  <button
                    className="nav-link d-flex justify-content-between"
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setTab(3);
                    }}
                  >
                    Become Seller
                    {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                  </button>
                )}
                {isShop && (
                  <button
                    className="nav-link d-flex justify-content-between"
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setTab(4);
                    }}
                  >
                    Create Product
                    {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                  </button>
                )}
                {isShop && (
                  <button
                    className="nav-link d-flex justify-content-between"
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setTab(5);
                    }}
                  >
                    Products Draft
                    {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                  </button>
                )}
                {isShop && (
                  <button
                    className="nav-link d-flex justify-content-between"
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setTab(6);
                    }}
                  >
                    Create Coupon
                    {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                  </button>
                )}
                {isShop && (
                  <button
                    className="nav-link d-flex justify-content-between"
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setTab(7);
                    }}
                  >
                    List Coupons
                    {/* <span className="badge2">{orders ? orders.length : 0}</span> */}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* panels */}
        <div
          className="tab-content col-lg-8 pb-5 pt-lg-0 pt-3"
          id="v-pills-tabContent"
        >
          <div
            className="tab-pane fade show active"
            id="v-pills-home"
            role="tabpanel"
            aria-labelledby="v-pills-home-tab"
          >
            {tab === 1 && <ProfileTabs userInfo={userInfo} />}{" "}
          </div>

          <div
            className="tab-pane fade"
            id="v-pills-profile"
            role="tabpanel"
            aria-labelledby="v-pills-profile-tab"
          >
            {tab === 2 && <Orders />}
          </div>
          <div
            className="tab-pane fade show active"
            id="v-pills-home"
            role="tabpanel"
            aria-labelledby="v-pills-home-tab"
          >
            {tab === 3 && (
              <SellerTabs
                userInfo={userInfo}
                isShopTrue={() => {
                  setisShop(true);
                  setTab(1);
                }}
              />
            )}{" "}
            {tab === 4 && <AddProductMain userInfo={userInfo} />}{" "}
            {tab === 5 && (
              <DraftProducts
                productShop={userInfo}
                shopId={userInfo?._id}
                brand=""
                keyword=""
                pagenumber=""
              />
            )}{" "}
            {tab === 6 && <CreateCoupon userInfo={userInfo} />}{" "}
            {tab === 7 && <ListCoupons userInfo={userInfo} />}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
