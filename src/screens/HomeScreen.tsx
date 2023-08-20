import { useEffect, useState } from "react";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopSection from "../components/homeComponents/ShopSection";
import { useLocation } from "react-router-dom";

const HomeScreen = () => {
  window.scrollTo(0, 0);
  const location = useLocation();

  const [keyword, setkeyword] = useState<any>(location.pathname.split("/")[2]);
  useEffect(() => {
    setkeyword(location.pathname.split("/")[2]);
  }, [location.pathname]);

  return (
    <div>
      <ShopSection keyword={keyword}/>
      <CalltoActionSection />
      <ContactInfo />
    </div>
  );
};

export default HomeScreen;
