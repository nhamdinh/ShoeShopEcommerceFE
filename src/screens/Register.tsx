import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { useNavigate } from "react-router-dom";
import { ACCESSTOKEN_STORAGE, NAME_STORAGE } from "../utils/constants";
import { useRegisterMutation } from "../store/components/auth/authApi";
import { formatPhone } from "../utils/commonFunction";
import { openToast } from "../store/components/customDialog/toastSlice";

const Register = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();

  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [phone, setphone] = useState<any>("");
  const [isError, setisError] = useState<any>(false);
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();
  // console.log(error);

  const onRegister = async (values: any) => {
    await register(values)
      .then((res: any) => {
        // console.log(res)
        // res?.data = {
        //   message: "register CREATED",
        //   metadata: {
        //     _id: "654a32065323eddeedb7ec6e",
        //     name: "name2",
        //   },
        //   status: "success",
        //   code: 201,
        // };
        const data = res?.data?.metadata;

        if (data) {
          localStorage.setItem(ACCESSTOKEN_STORAGE, data.token);
          localStorage.setItem(NAME_STORAGE, data.name);
          navigate("/");
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "Register User Success",
              step: 1,
            })
          );
        } else {
          setisError(true);
          // res?.error?.data = {
          //   message: "Invalid email",
          //   status: "error",
          //   code: 422,
          // };

          // const error = res?.error;
          // const dataError = error?.data ?? [];
          // if (dataError?.length > 0) {
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
      })
      .catch((err: any) => {});
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
      {isError && <Message variant="alert-danger" mess={error} />}

      <form
        className="Login col-md-8 col-lg-4 col-11"
        onSubmit={(e) => {
          e.preventDefault();
          // console.log(isValid());
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
