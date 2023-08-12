import CartScreen from "../screens/CartScreen";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";
import SingleProduct from "../screens/SingleProduct";

export const PrivateRoutes = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/product-detail",
    element: <SingleProduct />,
  },
  {
    path: "/cart/:id",
    element: <CartScreen />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
