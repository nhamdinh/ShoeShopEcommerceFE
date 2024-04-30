import React, { useEffect, useState } from "react";
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
import PublishedProducts from "../components/ProductsShop/PublishedProducts";
import DocumentTitle from "../components/DocumentTitle";

const ProfileScreen = () => {
  // window.scrollTo(0, 0);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [tab, setTab] = useState<any>(1);

  const userInfo = useSelector(getUserInfo);
  const [isShop, setisShop] = useState<any>(userInfo.isShop);

  useEffect(() => {
    setisShop(userInfo.isShop);
  }, [userInfo]);
  const concurrencyRequest = async (urls: any, maxNum: any) => {
    if (urls.length === 0) {
      // Nếu danh sách URLs trống, giải quyết ngay lập tức với mảng kết quả trống
      return Promise.resolve([]);
    }

    const results: any = []; // Mảng kết quả từ các yêu cầu
    let index = 0; // Chỉ số của URL đang được xử lý
    let count = 0; // Số lượng yêu cầu đã hoàn thành

    async function request() {
      if (index === urls.length) return; // Nếu đã xử lý tất cả các URL, thoát khỏi hàm

      const i = index; // Lưu chỉ số để sử dụng trong async function
      const url = urls[index++]; // Lấy URL và tăng chỉ số

      try {
        // Thực hiện yêu cầu fetch và lưu kết quả vào mảng
        results[i] = await fetch(url);
      } catch (err) {
        // Nếu có lỗi, lưu lỗi vào mảng kết quả
        results[i] = err;
      } finally {
        // Tăng biến đếm và kiểm tra hoàn thành tất cả các yêu cầu
        if (++count === urls.length) {
          console.log("Hoàn thành tất cả yêu cầu");
          // resolve(results);
        }

        // Đặt thời gian chờ 1 giây và sau đó gọi lại hàm yêu cầu
        setTimeout(request, 1000);
      }
    }

    const times = Math.min(maxNum, urls.length); // Số lần yêu cầu tối đa có thể được thực hiện đồng thời
    console.log(`:::times::`, times);

    // Bắt đầu thực hiện yêu cầu đồng thời
    const zzz = Array.from({ length: times }, () => setTimeout(request, 1000));
    // console.log(`:::zzz::`, zzz);
  };

  const urls: any = [];
  for (let i = 1; i <= 21; i++) {
    urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
  }
  // console.log(urls);
  const [tab1, setTab1] = useState<any>(1);

  const handleClick = () => {
    setTab1((pre: any) => pre + 1);
    concurrencyRequest(urls, 3);
  };

  return (
    <>
      <DocumentTitle title={"Profile"}></DocumentTitle>

      <div className="container mt-lg-5 mt-3">
        <div className="row align-items-start">
          <div className="col-lg-4 p-0 shadow ">
            <div className="author-card pb-0 pb-md-3">
              <div className="author-card-cover"></div>
              <div className="author-card-profile row">
                <div className="author-card-avatar col-md-5">
                  <img
                    src={userInfo.avatar ?? mainLogo3}
                    alt="userprofileimage"
                  />
                </div>
                <div className="author-card-details col-md-7">
                  <h5 className="author-card-name mb-2">
                    <strong>{userInfo?.name}</strong> <br />
                    <strong>
                      {formatCustomerPhoneNumber(userInfo?.phone)}
                    </strong>
                  </h5>
                  <span className="author-card-position">
                    <>Joined {moment(userInfo?.createdAt).format("LL")}</>
                  </span>
                  <div>
                    {/* <Child name={"kame"} />
                  <div>{tab1}</div>
                  <button onClick={handleClick}>+</button> */}
                  </div>
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
                      navigate("/shipping");
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
                        setTab(8);
                      }}
                    >
                      Products Published
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
              {tab === 8 && (
                <PublishedProducts
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
    </>
  );
};
const Child = React.memo((props: any) => {
  console.log("rendered");
  return <>{props.name}</>;
});
export default ProfileScreen;
