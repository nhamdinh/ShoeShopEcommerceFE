import { REGEX_CURRENCY } from "./constants";

export const passwordCheck = (pass: any) => {
  let regex =
    /^(?=[^0-9\n]*[0-9])(?=.*[a-zA-Z])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,20}$/;
  if (regex.exec(pass) == null) {
    // alert("invalid password!");
    return false;
  } else {
    // console.log("valid");
    return true;
  }
};

export const getUrlParams = (id: string) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let paramValue = urlParams.get(id) || "";
  return paramValue;
};

export const removeNonNumeric = (num: string) => {
  const result = ~~num.replace(/[^\d]/g, "");
  return result;
};

export const addCommas = (num: any, style = ",") => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, style);
};

export const formatMoney = (text: any) => {
  if (!text) {
    return "0";
  }
  if (+text < 0) {
    text = +text * -1;
    return "-" + text.toString().replace(REGEX_CURRENCY, "$1,");
  }
  return text.toString().replace(REGEX_CURRENCY, "$1,");
};

// export const formatMoney = (text: any) => {
//   if (!text) {
//     return "0";
//   } else {
//     if (+text < 0) {
//       text = +text * -1;
//       return "-" + addCommas(removeNonNumeric(text.toString()));
//     } else {
//       return addCommas(removeNonNumeric(text.toString()));
//     }
//   }
// };

export const formatMoneyCurrency = (text: any) => {
  if (!text) {
    return "0.00";
  }
  //format china currency delivery_type === 1
  // console.log(text)
  let numberText = +text;
  if (+text < 0) {
    numberText = +numberText * -1;
  }

  let string = numberText.toFixed(2).toString();
  let length = string.length;
  let string_slice = string.substr(0, length - 3);
  let string_slice3 = string.substr(length - 3, length - 1);
  if (+text < 0)
    return (
      "-" +
      string_slice.toString().replace(REGEX_CURRENCY, "$1,") +
      string_slice3
    );
  return string_slice.toString().replace(REGEX_CURRENCY, "$1,") + string_slice3;
};

export const formatCustomerPhoneNumber = (value: string) => {
  if (!value) return;
  //KOC 516
  return `${value.slice(0, 4)}-${value.slice(4, 7)}-${value.slice(7)}`;
};

export const formatPhone = (val: string) => {
  return val.replace(" ", "").replace(/[^0-9 ]+/g, "");
};

export const rawMarkup = (rawMarkup = "") => {
  return { __html: rawMarkup };
};

export const toNonAccentVietnamese = (str: any) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Ả|Â|Ấ|Ầ|Ẫ|Ậ|Ẩ|Ă|Ắ|Ằ|Ẵ|Ặ|Ẳ/g, "A");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ẻ|Ê|Ế|Ề|Ễ|Ệ|Ể/, "E");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/I|Í|Ì|Ĩ|Ị|Ỉ/g, "I");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ỗ|Ộ|Ổ|Ơ|Ớ|Ờ|Ỡ|Ợ|Ở/g, "O");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ữ|Ự|Ử/g, "U");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ|Ỷ/g, "Y");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  // str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export const calPerDiscount = (product: any) => {
  if (!product?.product_original_price) return 0;
  const perDiscount = (
    (1 - product?.product_price / product?.product_original_price) *
    100
  ).toFixed(0);
  return perDiscount;
};

export const removeNullObject = (obj: any) => {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      obj[key] = removeNullObject(obj[key]);
      // if (Object.keys(obj[key]).length === 0) {
      //   delete obj[key];
      // }
    }
  }

  return obj;
};
export const addZero = (number: any) => {
  let numberString = number.toString();
  if (Number(number) - 10 < 0) {
    numberString = "0" + numberString;
  }
  return numberString;
};

export const cartesianProduct = (data: any, result = {}) => {
  if (data.length === 0) {
    return [result];
  }

  const current = data[0];
  const rest = data.slice(1);
  const newResult: any = [];

  for (let value of current.values) {
    const newEntry = { ...result, [current.name]: value };
    newResult.push(...cartesianProduct(rest, newEntry));
  }

  return newResult;
};

export const equal = (a: any, b: any) => {
  if (a.length !== b.length) {
    return false;
  } else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
};

export const countOccurrences = (arr: any) => {
  return arr.reduce(function (a: any, b: any) {
    a[b] = a[b] + 1 || 1;
    return a;
  }, {});
};
