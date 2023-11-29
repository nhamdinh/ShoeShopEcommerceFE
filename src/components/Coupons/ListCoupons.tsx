import "./style.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker, DatePickerProps } from "antd";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { FORMAT_DATE, regexOnlyNumber } from "../../utils/constants";

import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import { formatMoney } from "../../utils/commonFunction";
import ProductsShopTable from "../ProductsShop/ProductsShopTable";
import {
  useCreateCouponMutation,
  useGetCouponsByShopQuery,
} from "../../store/components/coupons/couponsApi";
import moment from "moment";

const ListCoupons = () => {
  const dispatch = useDispatch();
  const [dataFetched, setdataFetched] = useState<any>([]);
  const [totalCount, settotalCount] = useState<any>(0);

  const {
    data: dataCoupons,
    error,
    isSuccess,
    isLoading,
  } = useGetCouponsByShopQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataCoupons?.metadata?.discounts);
      settotalCount(dataCoupons?.metadata?.totalCount);
    }
  }, [dataCoupons]);
  return (
    <>
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <div className="content-header">
          <div className=" opa0"></div>
          <h2 className="content-title">ListCoupons</h2>
          <div className="opa0"></div>
        </div>

        <div className="row mb-4">
          <div className="col-xl-12 col-lg-12">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                {error && (
                  <Message variant="alert-danger" mess={error}></Message>
                )}
                {isLoading && <Loading />}
                <h3 className="form-label">totalCount: {totalCount}</h3>

                {dataFetched.map((item: any, index: number) => (
                  <div className="mb-4" key={index}>
                    {index + 1}.
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_type</h6>
                      {item.discount_type}
                      <h6 className="form-label">discount_value</h6>
                      {formatMoney(item.discount_value)}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_start</h6>
                      {moment(item?.discount_start).format(FORMAT_DATE)}
                      <h6 className="form-label">discount_end</h6>
                      {moment(item?.discount_end).format(FORMAT_DATE)}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_code</h6>
                      {item?.discount_code}
                      <h6 className="form-label">discount_quantity</h6>
                      {item?.discount_quantity}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_useMax_user</h6>
                      {item?.discount_useMax_user}
                      <h6 className="form-label">discount_order_minValue</h6>
                      {item?.discount_order_minValue}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_applyTo</h6>
                      {item?.discount_applyTo}
                    </div>
                    {item?.discount_applyTo === "products_special" && (
                      <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                        <h6 className="form-label">discount_productIds</h6>
                        <div className="ProductsShopTable__row">
                          {item?.discount_productIds.map(
                            (it: any, index: number) => (
                              <div
                                className="dropdown-row"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // submitHandler(item?.name, brand);
                                }}
                                key={it?._id}
                              >
                                <div className="name">{index + 1}.</div>
                                <div className="name">{it?.product_name}</div>
                                <img
                                  src={it?.product_thumb}
                                  alt="product_thumb"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListCoupons;
