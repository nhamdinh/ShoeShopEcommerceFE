export const API_LINK =
  process.env.REACT_APP_API_URL ??
  "http://ec2-18-139-1-145.ap-southeast-1.compute.amazonaws.com:5000/api";
export const SOCKET_HOST =
  process.env.REACT_APP_SOCKET_HOST ??
  "http://ec2-18-139-1-145.ap-southeast-1.compute.amazonaws.com:6000";

// export const API_LINK = 'http://localhost:5000/api';
// export const SOCKET_HOST = 'http://localhost:6000';
/* env */
export const NAME_STORAGE = "nameUser";
export const ACCESSTOKEN_STORAGE = "accessTokenUser";
export const REFRESHTOKEN_STORAGE = "refreshTokenUser";
export const FOLDER_PRODUCS_STORAGE = "products";
export const SHIPPINGPRICE = 9.99;
export const TAXPRICE = 0.1;
export const PAGE_SIZE = 9;
export const FORMAT_DATE = "YYYY-MM-DD HH:mm:ss";
export const FORMAT_DATE8 = "YYYY-MM-DD";
export const REGEX_CURRENCY = /(\d)(?=(\d{3})+(?!\d))/g;
export const Toastobjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 1000,
};
export const regexOnlyNumber = /^[0-9\b]+$/;
export const PRODUCT_CATEGORIES_REAL = [
  { value: "all", label: "All Products", product_type: "" },
  {
    value: "household",
    label: "Household",
    icon: "icon-burger-soda-solid",
    color: "header",
    product_type: "household",
  },
  {
    value: "electronic",
    label: "Electronics",
    icon: "icon-laptop-mobile-solid",
    color: "accent",
    product_type: "electronic",
  },
  {
    value: "clothing",
    label: "Clothing",
    icon: "icon-shirt-solid",
    color: "red",
    product_type: "clothing",
  },
  {
    value: "furniture",
    label: "Furniture",
    icon: "icon-user-gear-solid",
    color: "yellow",
    product_type: "furniture",
  },
];

export const ORDER_SORT_OPTIONS = [
  {
    value: "default",
    label: "Default sorting",
    orderByKey: "_id",
    orderByValue: -1,
  },
  {
    value: "a-z",
    label: "Name: A-Z",
    orderByKey: "product_name",
    orderByValue: 1,
  },
  {
    value: "z-a",
    label: "Name: Z-A",
    orderByKey: "product_name",
    orderByValue: -1,
  },
  {
    value: "Price-high-to-low",
    label: "Price: High -> Low",
    orderByKey: "product_price",
    orderByValue: -1,
  },
  {
    value: "Price-low-to-high",
    label: "Price: Low -> High",
    orderByKey: "product_price",
    orderByValue: 1,
  },
];
