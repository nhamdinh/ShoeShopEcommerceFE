import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { useNavigate } from "react-router-dom";
import { ACCESSTOKEN_STORAGE, NAME_STORAGE } from "../utils/constants";
import { useRegisterMutation } from "../store/components/auth/authApi";
import { formatPhone } from "../utils/commonFunction";

const Register = () => {
  window.scrollTo(0, 0);
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [phone, setphone] = useState<any>("");
  const [isError, setisError] = useState<any>(false);
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();

  const onRegister = async (values: any) => {
    const res = await register(values);

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

  const isValid = () => {
    return !(
      phone.length !== 10 ||
      name === "" ||
      email === "" ||
      password === ""
    );
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center login-center">
      {isError && (
        <Message variant="alert-danger" mess={JSON.stringify(error)} />
      )}

      <form
        className="Login col-md-8 col-lg-4 col-11"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(isValid());
          if (isValid())
            onRegister({
              name: name,
              email: email,
              password: password,
              phone: phone,
              isAdmin: false,
            });
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setisError(false);
          }}
        />
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
        <input
          type="text"
          placeholder="Phone(10)"
          maxLength={10}
          value={phone}
          onChange={(e) => {
            setphone(formatPhone(e.target.value));
            setisError(false);
          }}
        />
        <button type="submit">{isLoading ? <Loading /> : "Register"}</button>
        <p>
          <Link to="/login">
            I Have Account <strong>Login</strong>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
