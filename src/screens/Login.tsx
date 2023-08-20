import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/components/auth/authApi";
import { ACCESSTOKEN_STORAGE, NAME_STORAGE } from "../utils/constants";

const Login = () => {
  window.scrollTo(0, 0);

  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [isError, setisError] = useState<any>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const onLogin = async (values: any) => {
    const res = await login(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      localStorage.setItem(ACCESSTOKEN_STORAGE, data.token);
      localStorage.setItem(NAME_STORAGE, data.name);
      navigate("/");
    } else {
      setisError(true);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center login-center">
      {isError && (
        <Message variant="alert-danger" mess="Invalid Email or Password" />
      )}
      <form
        className="Login col-md-8 col-lg-4 col-11"
        onSubmit={(e) => {
          e.preventDefault();
          // onLogin({ email: "admin@example.com", password: "123456" });
          onLogin({ email: email, password: password });
        }}
      >
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
        >
          Create Account
        </p>
      </form>
    </div>
  );
};

export default Login;
