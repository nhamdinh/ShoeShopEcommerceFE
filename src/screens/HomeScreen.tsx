import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import ShopSection from "../components/homeComponents/ShopSection";

const HomeScreen = ({ match }: any) => {
  window.scrollTo(0, 0);

  return (
    <div>
      <ShopSection />
      <CalltoActionSection />
      <ContactInfo />
    </div>
  );
};

export default HomeScreen;
