import "./App.scss";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { PrivateRoutes } from "./routers";
import TopHeader from "./components/TopHeader";
import Toast from "./components/LoadingError/Toast";
import CustomDialog from "./components/customDialog";
import { REACT_ENV } from "./utils/constants";
import ChatBox from "./components/ChatBox";

const App = () => {
  console.log("env ::: ", REACT_ENV);
  const location = useLocation();

  return (
    <div className="app-wrapper">
      <TopHeader />
      {location.pathname.includes("login") ||
      location.pathname.includes("register") ? (
        <></>
      ) : (
        <Header />
      )}
      <Routes>
        {PrivateRoutes.map((item, index) => (
          <Route key={index} path={item.path} element={item.element} />
        ))}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
      <CustomDialog />
      <Toast />
      <Footer />
      <ChatBox />{" "}
    </div>
  );
};

export default App;
