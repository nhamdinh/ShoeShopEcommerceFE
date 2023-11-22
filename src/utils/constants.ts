// export const API_LINK = "http://localhost:5000/api";
export const API_LINK = process.env.REACT_APP_BASE_API_URL;
export const REACT_ENV = process.env.REACT_PUBLIC_ENVV;
export const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST;
/* env */
export const NAME_STORAGE = "name";
export const ACCESSTOKEN_STORAGE = "accessToken";
export const REFRESHTOKEN_STORAGE = "refreshToken";
export const SHIPPINGPRICE = 9.99;
export const TAXPRICE = 0.1;
export const PAGE_SIZE = 6;
export const REGEX_CURRENCY = /(\d)(?=(\d{3})+(?!\d))/g
export const Toastobjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
