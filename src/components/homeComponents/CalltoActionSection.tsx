import React, { useEffect, useState } from "react";
import { useSendEmailMutation } from "../../store/components/auth/authApi";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import Loading from "../LoadingError/Loading";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { removeNullObject } from "../../utils/commonFunction";

const CalltoActionSection = ({ productShop }: any) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const [email, setEmail] = useState<any>("");
  const [sendEmail, { isLoading, error }] = useSendEmailMutation();
  const onSendEmail = async (values: any) => {
    await sendEmail(values)
      .then((res: any) => {
        const data = res?.data;
        if (data) {
          console.log(data);
          // setEmail("");
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "A Email Has been send !",
              step: 1,
            })
          );
        } else {
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: res?.error?.data?.message ?? "Failed !",
              step: 2,
            })
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="subscribe-section bg-with-black">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="subscribe-head">
              <h2 className="fw600 shadow__orangered">FOLLOW SHOP</h2>
              <p>Sign up free and get the latest tips.</p>
              <div className="form-section">
                {!userInfo?._id && (
                  <input
                    placeholder="Your Email..."
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                    }}
                  />
                )}

                {isLoading ? (
                  <Loading />
                ) : (
                  <input
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      const params = {
                        email,
                        id: userInfo?._id,
                        productShopName: productShop?.productShopName,
                        productShopId: productShop?._id,
                      };
                      if (params.email || params.id) {
                        onSendEmail(removeNullObject(params));
                      } else {
                        dispatch(
                          openToast({
                            isOpen: Date.now(),
                            content: "You need Login or Enter your Email !",
                            step: 2,
                          })
                        );
                      }
                    }}
                    value="Yes. I want!"
                    name="subscribe"
                    type="submit"
                    className="bgc__123b7a"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalltoActionSection;
