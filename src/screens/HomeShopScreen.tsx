import "./style.scss";
import { useEffect, useState } from "react";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopDetailSection from "../components/homeComponents/ShopDetailSection";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProfileShopQuery } from "../store/components/auth/authApi";
import DocumentTitle from "../components/DocumentTitle";

const HomeShopScreen = () => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [shopId, setshopId] = useState<any>(location.pathname.split("/")[2]);

  const {
    data: dataProfileShop,
    error,
    isSuccess,
    isLoading,
  } = useGetProfileShopQuery(
    {
      product_shop: shopId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  const [searchInput, setSearchInput] = useState<any>("");
  const [keyword, setKeyword] = useState<any>("");
  const [pagenumber, setpagenumber] = useState<any>(1);
  const [brand, setbrand] = useState<any>("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // setkeyword(urlParams.get("search") ?? "");
    setbrand(urlParams.get("brand") ?? "");
    setpagenumber(urlParams.get("page") ?? 1);
  }, [location.search]);
  
  let countdown: any = null;

  useEffect(() => {
    clearTimeout(countdown);
    countdown = setTimeout(() => {
      setKeyword(searchInput);
      setpagenumber(1);
      if (pagenumber !== 1) {
        // navigate(`${location.pathname}?page=1`);
      }
    }, 700);
    return () => {
      clearTimeout(countdown);
    };
  }, [searchInput]);

  return (
    <>
      <DocumentTitle title={"Shop Home"}></DocumentTitle>
      <CalltoActionSection productShop={dataProfileShop?.metadata} />
      <div className="container df content__center mt24px mb24px">
        <div className="col-md-6 col-8 d-flex align-items-center column content__center position__relative">
          <div className="input-group">
            <input
              type="search"
              className="form-control rounded search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <ShopDetailSection
        keyword={keyword}
        pagenumber={pagenumber}
        brand={brand}
        shopId={shopId}
        productShop={dataProfileShop?.metadata}
      />
    </>
  );
};

export default HomeShopScreen;
