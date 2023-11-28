import "./style.scss";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { FOLDER_PRODUCS_STORAGE, regexOnlyNumber } from "../../utils/constants";
import {
  useCreateProductMutation,
  useGetBrandsQuery,
  useUploadImgMutation,
  useGetCodesQuery,
} from "../../store/components/products/productsApi";
import { Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import { formatMoney } from "../../utils/commonFunction";

const SIZE = 5;
const sizeMax = SIZE * 1000 * 1000;

const CreateCoupon = ({ userInfo }: any) => {
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadImg, { isLoading: isLoadingUpload }] = useUploadImgMutation();

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    let sizeImg = file ? Number(file?.size) : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);

      try {
        const res: any = await uploadImg({
          formData,
          folder: FOLDER_PRODUCS_STORAGE,
        });
        let data = res?.data;
        if (data) {
          let fileList_temp: any = [];
          fileList_temp.push({
            url: data?.url,
          });
          setFileList(fileList_temp);
          setImage(data?.url);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const [categor, setcategory] = useState<any>("");
  const [categorys, setcategorys] = useState<any>([]);

  const {
    data: dataFetch,
    error: errdataProducts,
    isSuccess: isSuccesscategorys,
    isLoading: isLoadingdataProducts,
  } = useGetCodesQuery(
    {
      mainCode_type: "PRODUCT_MODEL",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccesscategorys) {
      setcategorys(dataFetch?.metadata?.mainCodes);
      setcategory(dataFetch?.metadata?.mainCodes[0]?.mainCode_value);
    }
  }, [dataFetch]);

  const [discount_applyTo, setdiscount_applyTo] = useState<any>("all");
  const [discount_applyTos, setdiscount_applyTos] = useState<any>([
    "all",
    "products_special",
  ]);
  const [discount_type, setdiscount_type] = useState<any>("percent");
  const [discount_types, setbrands] = useState<any>([
    "percent",
    "fixed_amount",
  ]);

  useEffect(() => {
    setdiscount_value(0);
  }, [discount_type]);

  const [discount_value, setdiscount_value] = useState<any>("");
  const [discount_code, setdiscount_code] = useState<any>("");
  const [discount_description, setdiscount_description] = useState<any>("");
  const [discount_quantity, setdiscount_quantity] = useState<any>("");
  const [discount_useMax_user, setdiscount_useMax_user] = useState<any>("");
  const [discount_order_minValue, setdiscount_order_minValue] =
    useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [image, setImage] = useState<any>("");
  const [countInStock, setCountInStock] = useState<any>(0);
  const [description, setDescription] = useState<any>("");

  const [createProduct, { isLoading, error }] = useCreateProductMutation();

  const onCreateProduct = async (values: any) => {
    const res = await createProduct(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Added Product Success",
          step: 1,
        })
      );

      setdiscount_code("");
      setDescription("");
      setCountInStock(0);
      setImage("");
      setPrice(0);
      setFileList([]);
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Add Product Failed",
          step: 2,
        })
      );
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    onCreateProduct({
      product_name: discount_code,
      product_description: description,
      product_price: price,
      product_thumb: image,
      product_quantity: countInStock,
      product_shop: userInfo._id,
      product_type: categor,
      product_attributes: {
        brand: discount_type,
        size: "10inch",
        material: "gold",
      },
      // category: {
      //   name: categor,
      //   brand: brand,
      // },
    });
  };
  //   console.log(+discount_order_minValue);
  return (
    <>
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link
              to={`/shop/${userInfo._id}`}
              className="btn btn-danger text-white"
            >
              Go to products
            </Link>
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
                      value={discount_code}
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
                    <label htmlFor="product_price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Count In Stock
                    </label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Type here"
                      className="form-control"
                      rows={7}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Images</label>
                    <Upload
                      fileList={fileList}
                      listType="picture-card"
                      accept=".png,.jpeg,.gif,.jpg"
                      onChange={onChange}
                      onPreview={onPreview}
                      customRequest={uploadImage}
                    >
                      {fileList.length < 1 && "Choose file"}
                    </Upload>
                  </div>
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
