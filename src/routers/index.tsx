import CartScreen from "../screens/CartScreen";
import HomeScreen from "../screens/HomeScreen";
import HomeShopScreen from "../screens/HomeShopScreen";
import Login from "../screens/Login";
import NotFound from "../screens/NotFound";
import OrderScreen from "../screens/OrderScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PlaceOrderScreen from "../screens/PlaceOrderScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Register from "../screens/Register";
import ShippingScreen from "../screens/ShippingScreen";
import SingleProduct from "../screens/SingleProduct";

export const PrivateRoutes = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/shop/:id",
    element: <HomeShopScreen />,
  },
  {
    path: "/product-detail",
    element: <SingleProduct />,
  },
  {
    path: "/cart",
    element: <CartScreen />,
  },
  {
    path: "/profile",
    element: <ProfileScreen />,
  },
  {
    path: "/shipping",
    element: <ShippingScreen />,
  },
  {
    path: "/payment",
    element: <PaymentScreen />,
  },
  {
    path: "/placeorder",
    element: <PlaceOrderScreen />,
  },
  {
    path: "/order/:id",
    element: <OrderScreen />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
