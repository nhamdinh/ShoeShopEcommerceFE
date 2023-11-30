import "./style.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker, DatePickerProps } from "antd";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { regexOnlyNumber } from "../../utils/constants";

import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import { formatMoney } from "../../utils/commonFunction";
import ProductsShopTable from "../ProductsShop/ProductsShopTable";
import { useCreateCouponMutation } from "../../store/components/coupons/couponsApi";

const CreateCoupon = ({ userInfo }: any) => {
  const dispatch = useDispatch();

  const [discount_applyTo, setdiscount_applyTo] = useState<any>("all");
  const [discount_applyTos, setdiscount_applyTos] = useState<any>([
    "all",
    "products_special",
  ]);
  const [discount_productIds, setdiscount_productIds] = useState<any>([]);
  const [discount_type, setdiscount_type] = useState<any>("percent");
  const [discount_types, setbrands] = useState<any>([
    "percent",
    "fixed_amount",
  ]);

  useEffect(() => {
    setdiscount_value(0);
  }, [discount_type]);

  const [discount_start, setdiscount_start] = useState<any>();
  const [discount_end, setdiscount_end] = useState<any>();
  const [discount_value, setdiscount_value] = useState<any>("");
  const [discount_code, setdiscount_code] = useState<any>("");
  const [discount_description, setdiscount_description] = useState<any>("");
  const [discount_quantity, setdiscount_quantity] = useState<any>("");
  const [discount_useMax_user, setdiscount_useMax_user] = useState<any>("");
  const [discount_order_minValue, setdiscount_order_minValue] =
    useState<any>("");

  const [createCoupon, { isLoading, error }] = useCreateCouponMutation();

  const onCreateCoupon = async (values: any) => {
    // console.log(values);
    const res = await createCoupon(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Added Coupon Success",
          step: 1,
        })
      );

      setdiscount_code("");
      setdiscount_value("");
      setdiscount_description("");
      setdiscount_quantity("");
      setdiscount_useMax_user("");
      setdiscount_order_minValue("");
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Add Coupon Failed",
          step: 2,
        })
      );
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    onCreateCoupon({
      discount_code: discount_code.trim(),
      discount_description: discount_description.trim(),
      discount_type: discount_type,
      discount_value: +discount_value,
      discount_start: discount_start,
      discount_end: discount_end,
      discount_quantity: +discount_quantity,
      discount_useMax_user: +discount_useMax_user,
      discount_order_minValue: +discount_order_minValue,
      discount_shopId: userInfo?._id,
      discount_applyTo: discount_applyTo,
      discount_productIds:
        discount_applyTo === "all" ? [] : discount_productIds,
    });
  };
  //   console.log(+discount_order_minValue);

  const onChangeDateStart: DatePickerProps["onChange"] = (date, dateString) => {
    setdiscount_start(new Date(dateString).toJSON());
  };
  const onChangeDateEnd: DatePickerProps["onChange"] = (date, dateString) => {
    setdiscount_end(new Date(dateString).toJSON());
  };
  return (
    <>
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <div className=" opa0">Go to coupons</div>
            <h2 className="content-title">CreateCoupon</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Publish now
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && (
                    <Message variant="alert-danger" mess={error}></Message>
                  )}
                  {isLoading && <Loading />}
                  <div className="mb-4">
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_type</h6>
                      <select
                        className="form-label"
                        value={discount_type}
                        onChange={(e) => setdiscount_type(e.target.value)}
                      >
                        {discount_types.map((br: any, index: number) => (
                          <option className="form-label" key={index} value={br}>
                            {br}
                          </option>
                        ))}
                      </select>
                      <h6 className="form-label">discount_value</h6>

                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="product_title"
                        required
                        maxLength={discount_type === "percent" ? 2 : 6}
                        value={formatMoney(discount_value)}
                        onChange={(e) => {
                          let val = e.target.value;
                          val = val.replaceAll(",", "");
                          if (!val || val.match(regexOnlyNumber)) {
                            setdiscount_value(val);
                          } else {
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_start</h6>
                      <DatePicker
                        allowClear={true}
                        onChange={onChangeDateStart}
                      />
                      <h6 className="form-label">discount_end</h6>

                      <DatePicker
                        allowClear={true}
                        onChange={onChangeDateEnd}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      discount_code
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={discount_code.toUpperCase()}
                      onChange={(e) => setdiscount_code(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      discount_description
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={discount_description}
                      onChange={(e) => setdiscount_description(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      discount_quantity
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      maxLength={5}
                      value={formatMoney(discount_quantity)}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replaceAll(",", "");
                        if (!val || val.match(regexOnlyNumber)) {
                          setdiscount_quantity(val);
                        } else {
                        }
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      discount_useMax_user
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      maxLength={5}
                      value={formatMoney(discount_useMax_user)}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replaceAll(",", "");
                        if (!val || val.match(regexOnlyNumber)) {
                          setdiscount_useMax_user(val);
                        } else {
                        }
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      discount_order_minValue
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      maxLength={8}
                      value={formatMoney(discount_order_minValue)}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replaceAll(",", "");
                        if (!val || val.match(regexOnlyNumber)) {
                          setdiscount_order_minValue(val);
                        } else {
                        }
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex-box d-flex justify-content-between align-items-center gap10px">
                      <h6 className="form-label">discount_applyTo</h6>
                      <select
                        className="form-label"
                        value={discount_applyTo}
                        onChange={(e) => setdiscount_applyTo(e.target.value)}
                      >
                        {discount_applyTos.map((br: any, index: number) => (
                          <option className="form-label" key={index} value={br}>
                            {br}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {discount_applyTo === "products_special" && (
                    <ProductsShopTable
                      pagenumber=""
                      keyword=""
                      brand=""
                      shopId={userInfo._id}
                      setproductIds={(productIds: any) => {
                        setdiscount_productIds(productIds);
                      }}
                    ></ProductsShopTable>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default CreateCoupon;
