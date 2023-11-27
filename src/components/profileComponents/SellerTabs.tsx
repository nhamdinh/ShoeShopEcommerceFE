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
    if (name) {
      const res = await updateIsShop({ productShopName: name });

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
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onUpdateIsShop();
  };
  const [name, setName] = useState<any>("");

  return (
    <>
      {error && <Message variant="alert-danger" mess={error}></Message>}
      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="product_title" className="form-label">
            Shop name
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="form-control"
            id="product_title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit">
          {isLoading ? <Loading /> : "Become Seller"}
        </button>
      </form>
    </>
  );
};

export default SellerTabs;
