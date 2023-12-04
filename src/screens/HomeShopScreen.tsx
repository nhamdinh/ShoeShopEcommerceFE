import "./style.scss";
import { useEffect, useState } from "react";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopDetailSection from "../components/homeComponents/ShopDetailSection";
import { useLocation } from "react-router-dom";
import { useGetProfileShopQuery } from "../store/components/auth/authApi";

const HomeShopScreen = () => {
  window.scrollTo(0, 0);

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

  const [keyword, setkeyword] = useState<any>("");
  const [brand, setbrand] = useState<any>("");
  const [pagenumber, setpagenumber] = useState<any>(1);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setkeyword(urlParams.get("search") ?? "");
    setbrand(urlParams.get("brand") ?? "");
    setpagenumber(urlParams.get("page") ?? 1);
  }, [location.search]);

  return (
    <>
      <ShopDetailSection
        keyword={keyword}
        pagenumber={pagenumber}
        brand={brand}
        shopId={shopId}
        productShop={dataProfileShop?.metadata}
      />
      <CalltoActionSection />
    </>
  );
};

export default HomeShopScreen;
