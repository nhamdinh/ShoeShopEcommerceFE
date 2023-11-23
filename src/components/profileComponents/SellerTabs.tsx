import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { useUpdateIsShopMutation } from "../../store/components/auth/authApi";
import { openToast } from "../../store/components/customDialog/toastSlice";

const SellerTabs = ({ userInfo, isShopTrue }: any) => {
  const dispatch = useDispatch();

  const [updateIsShop, { isLoading, error }] = useUpdateIsShopMutation();

  const onUpdateIsShop = async () => {
    const res = await updateIsShop({});

    //@ts-ignore
    const data = res?.data;
    if (data?.metadata?.isShop) {
      isShopTrue();
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Become Seller Profile Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Become Seller Profile Failed",
          step: 2,
        })
      );
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onUpdateIsShop();
  };
  return (
    <>
      {error && <Message variant="alert-danger" mess={error}></Message>}
      <form className="row  form-container" onSubmit={submitHandler}>
        <button type="submit">
          {isLoading ? <Loading /> : "Become Seller"}
        </button>
      </form>
    </>
  );
};

export default SellerTabs;
