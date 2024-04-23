import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/components/auth/authApi";
import {
  ACCESSTOKEN_STORAGE,
  NAME_STORAGE,
  REFRESHTOKEN_STORAGE,
} from "../utils/constants";
import { openToast } from "../store/components/customDialog/toastSlice";

const Login = () => {
  window.scrollTo(0, 0);

  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [isError, setisError] = useState<any>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, error }] = useLoginMutation();

  const onLogin = async (values: any) => {
    setisError(false);

    const res = await login(values);
    //@ts-ignore
    const data = res?.data?.metadata;

    if (data) {
      localStorage.setItem(ACCESSTOKEN_STORAGE, data?.token);
      localStorage.setItem(REFRESHTOKEN_STORAGE, data?.refreshToken);
      localStorage.setItem(NAME_STORAGE, data?.name);
      navigate("/");
    } else {
      setisError(true);
      //@ts-ignore
      // const error = res?.error;
      // const dataError = error?.data ?? [];
      // if (dataError?.length > 0) {
      //   console.log(dataError);
      //   dataError.map((err: any) => {
      //     const content = err?.msg ?? "Operate Failed";
      //     const myTimeout = setTimeout(() => {
      //       dispatch(
      //         openToast({
      //           isOpen: Date.now(),
      //           content: content,
      //           step: 2,
      //         })
      //       );
      //     }, 100);

      //     return () => clearTimeout(myTimeout);
      //   });
      // }
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center login-center">
      {isError && <Message variant="alert-danger" mess={error} />}
      <form
        className="Login col-md-8 col-lg-4 col-11"
        onSubmit={(e) => {
          e.preventDefault();
          // onLogin({ email: "admin@example.com", password: "123456" });
          onLogin({ email: email, password: password });
        }}
      >
        <h1>Welcome back!</h1>
        <p className="ed1c24 fw600">
          Đăng nhập bằng USER ở trên <br />Hoặc Đăng ký bằng Email mới
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setisError(false);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setisError(false);
          }}
        />
        <button type="submit">{isLoading ? <Loading /> : "Login"}</button>
        <p
          onClick={() => {
            navigate("/register");
          }}
          className="cursor__pointer"
        >
          Create Account
        </p>
      </form>
    </div>
  );
};

export default Login;
