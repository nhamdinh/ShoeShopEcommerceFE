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
  