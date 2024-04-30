import "./style.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { useNavigate } from "react-router-dom";
import { ACCESSTOKEN_STORAGE, NAME_STORAGE } from "../utils/constants";
import {
  useRegisterMutation,
  useRegisterSendEmailMutation,
  useSendEmailMutation,
} from "../store/components/auth/authApi";
import { formatPhone } from "../utils/commonFunction";
import { openToast } from "../store/components/customDialog/toastSlice";
import DocumentTitle from "../components/DocumentTitle";

const Register = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();

  const [otp, setOtp] = useState<any>("");
  const [showOtp, setShowOtp] = useState<any>(false);
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [phone, setphone] = useState<any>("");
  const [isError, setisError] = useState<any>(false);
  const navigate = useNavigate();

  const [registerSendEmail, { isLoading, error }] =
    useRegisterSendEmailMutation();
  // console.log(error);

  const onRegisterSendEmail = async (values: any) => {
    await registerSendEmail(values)
      .then((res: any) => {
        const data = res?.data?.metadata;
        if (data) {
          setShowOtp(true);
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "An OTP has been sent and expires in 3 minutes !",
              step: 1,
            })
          );
        } else {
          setisError(true);
        }
      })
      .catch((err: any) => {
        setisError(true);
      });
  };

  const [register, { isLoading: isLoading2, error: error2 }] =
    useRegisterMutation();

  const onRegister = async (values: any) => {
    await register(values)
      .then((res: any) => {
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
        }
      })
      .catch((err: any) => {
        setisError(true);
      });
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
    <>
      <DocumentTitle title={"Register"}></DocumentTitle>

      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        {isError && <Message variant="alert-danger" mess={error} />}
        {isError && <Message variant="alert-danger" mess={error2} />}

        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(isValid());
            if (isValid())
              onRegisterSendEmail({
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
          <button type="submit">
            {isLoading ? <Loading /> : "Send Email"}
          </button>
          {showOtp && (
            <>
              <div className="border__e92227 mt20px"></div>
              <input
                type="text"
                placeholder="OTP (6)"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setisError(false);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (isValid() && otp)
                    onRegister({
                      name: name,
                      email: email,
                      password: password,
                      phone: phone,
                      otp,
                      isAdmin: false,
                    });
                }}
                type="submit"
                style={{ background: "#1ea08a" }}
              >
                {isLoading2 ? <Loading /> : "Register"}
              </button>
            </>
          )}
          <p>
            <Link to="/login">
              I Have Account <strong>Login</strong>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
