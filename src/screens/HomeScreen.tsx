import "./style.scss";
import { useEffect, useState } from "react";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopSection from "../components/homeComponents/ShopSection";
import { useLocation } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

const HomeScreen = () => {
  window.scrollTo(0, 0);

  const location = useLocation();

  const [keyword, setKeyword] = useState<any>("");
  const [brand, setBrand] = useState<any>("");
  const [pagenumber, setpagenumber] = useState<any>(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setKeyword(urlParams.get("search") ?? "");
    setBrand(urlParams.get("brand") ?? "");
    setpagenumber(urlParams.get("page") ?? 1);
  }, [location.search]);
  
  return (
    <>
      <DocumentTitle title={"Home"}></DocumentTitle>
      <ShopSection keyword={keyword} pagenumber={pagenumber} brand={brand} />
      <ContactInfo />
    </>
  );
};

export default HomeScreen;
