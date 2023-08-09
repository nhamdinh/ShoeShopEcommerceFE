import HomeScreen from "../screens/HomeScreen";
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
];
