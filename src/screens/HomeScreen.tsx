import { useEffect, useState } from "react";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopSection from "../components/homeComponents/ShopSection";
import { useLocation } from "react-router-dom";

const HomeScreen = () => {
  window.scrollTo(0, 0);
  const location = useLocation();
  const [keyword, setkeyword] = useState<any>("");
  const [pagenumber, setpagenumber] = useState<any>(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setkeyword(urlParams.get("search") ?? "");
    setpagenumber(urlParams.get("page") ?? 1);
  }, [location.search]);
  return (
    <div>
      <ShopSection keyword={keyword} pagenumber={pagenumber} />
      <CalltoActionSection />
      <ContactInfo />
    </div>
  );
};

export default HomeScreen;
