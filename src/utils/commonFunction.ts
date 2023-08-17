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
  } else {
    if (+text < 0) {
      text = +text * -1;
      return "-" + addCommas(removeNonNumeric(text.toString()));
    } else {
      return addCommas(removeNonNumeric(text.toString()));
    }
  }
};
