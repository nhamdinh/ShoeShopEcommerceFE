import CartScreen from "../screens/CartScreen";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";
import ProfileScreen from "../screens/ProfileScreen";
import Register from "../screens/Register";
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
  {
    path: "/profile",
    element: <ProfileScreen />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];
