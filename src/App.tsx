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
import ChatBox from "./components/ChatBox";

const App = () => {
  console.log("env ::: ", process.env.REACT_PUBLIC_ENV);
  const location = useLocation();
  console.log(`API_LINK :::[${process.env.REACT_APP_API_URL}]`);

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
      {/* {location.pathname.includes("login") ||
      location.pathname.includes("register") ? (
        <></>
      ) : (
        <ChatBox />
      )} */}
    </div>
  );
};

export default App;
