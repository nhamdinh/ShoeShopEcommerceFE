import "./App.css";
import "./responsive.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { PrivateRoutes } from "./routers";

const App = () => {
  console.log("env:", process.env.REACT_PUBLIC_ENV);

  return (
    <div className="app-wrapper">
      <Header />
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

      <Footer />
    </div>
  );
};

export default App;
