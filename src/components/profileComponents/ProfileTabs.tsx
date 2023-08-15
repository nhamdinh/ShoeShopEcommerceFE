import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { NAME_STORAGE } from "../../utils/constants";
import { useUpdateProfileMutation } from "../../store/components/auth/authApi";

const ProfileTabs = ({ userInfo }: any) => {
  const [name, setName] = useState<any>(userInfo.name);
  const [email, setEmail] = useState<any>(userInfo.email);

  const [password, setPassword] = useState<any>("");
  const [confirmPassword, setConfirmPassword] = useState<any>("");
  const toastId = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };

  const dispatch = useDispatch();

  const userDetails: any = {};

  const userUpdateProfile: any = {};

  const [isError, setisError] = useState<any>(false);
  // console.log(err);

  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  const onUpdateProfile = async (values: any) => {
    const res = await updateProfile(values);

    //@ts-ignore
    const data = res?.data;
    console.log(data);
  };

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
    } else {
      onUpdateProfile({ name: name, email: email, password: password });
    }

    // Password match
  };
  return (
    <>
      {/* <Toast /> */}
      {error && <Message variant="alert-danger">{error}</Message>}
      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="col-md-6">
          <div className="form">
            <label htmlFor="account-fn">UserName</label>
            <input
              className="form-control"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form">
            <label htmlFor="account-email">E-mail Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label htmlFor="account-pass">New Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label htmlFor="account-confirm-pass">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">
          {isLoading ? <Loading /> : "Update Profile"}
        </button>
      </form>
    </>
  );
};

export default ProfileTabs;
