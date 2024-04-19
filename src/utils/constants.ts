export const API_LINK = process.env.REACT_APP_API_URL ?? "http://ec2-18-139-1-145.ap-southeast-1.compute.amazonaws.com:5000/api";
export const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST ?? 'http://ec2-18-139-1-145.ap-southeast-1.compute.amazonaws.com:6000';

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
