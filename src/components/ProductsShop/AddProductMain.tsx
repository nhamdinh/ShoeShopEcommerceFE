import "./style.scss";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { FOLDER_PRODUCS_STORAGE } from "../../utils/constants";
import {
  useCreateProductMutation,
  useGetBrandsQuery,
  useUploadImgMutation,
  useGetCodesQuery,
  useUploadImgUrlMutation,
} from "../../store/components/products/productsApi";
import { Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import LoadingButton from "../LoadingError/LoadingButton";

const SIZE = 5;
const sizeMax = SIZE * 1000 * 1000;

const AddProductMain = ({ userInfo }: any) => {
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState<any>([]);
  const [uploadImg, { isLoading: isLoadingUpload }] = useUploadImgMutation();
  const [uploadImgUrl, { isLoading: isLoadingUploadUrl }] =
    useUploadImgUrlMutation();

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
        const data = res?.data?.metadata;
        if (data) {
          handleImageAttribute(data);
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

  const [brand, setbrand] = useState<any>("");
  const [brands, setbrands] = useState<any>([]);

  const {
    data: brandsdata,
    error: brandsserror,
    isSuccess: brandsisSuccess,
    isLoading: isLoadingbrands,
  } = useGetBrandsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (brandsisSuccess) {
      setbrands(brandsdata?.brands);
      setbrand(brandsdata?.brands[0]?.brand);
    }
  }, [brandsdata]);

  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [image, setImage] = useState<any>("");
  const [urlImage, setUrlImage] = useState<any>("");
  const [product_thumb_small, setProduct_thumb_small] = useState<any>("");
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

      setName("");
      setDescription("");
      setCountInStock(0);

      setImage("");
      setProduct_thumb_small("");
      setFileList([]);

      setPrice(0);
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
      product_name: name,
      product_description: description,
      product_price: price,
      product_original_price: +((+price * ( (Math.random() * (50 - 10) + 10) +100    )/100).toFixed(2)),
      product_thumb: image,
      product_thumb_small,
      product_quantity: countInStock,
      product_shop: userInfo._id,
      product_type: categor,
      product_attributes: {
        brand: brand,
        size: "10inch",
        material: "gold",
      },
      // category: {
      //   name: categor,
      //   brand: brand,
      // },
    });
  };

  const onUploadImgUrl = async () => {
    try {
      const res: any = await uploadImgUrl({
        urlImage,
      });
      const data = res?.data?.metadata;
      if (data) {
        handleImageAttribute(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageAttribute = (data: any) => {
    setFileList([
      {
        url: data?.url,
      },
    ]);
    setImage(data?.url);
    setProduct_thumb_small(data?.thumb_url);
  };

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
            <h2 className="content-title">Add product</h2>
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
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Brand</h6>
                      <select
                        value={brand}
                        onChange={(e) => setbrand(e.target.value)}
                        className="capitalize"
                      >
                        {brands.map((br: any, index: number) => (
                          <option key={index} value={br?.brand}>
                            {br?.brand}
                          </option>
                        ))}
                      </select>
                      <h6>Category</h6>

                      <select
                        value={categor}
                        onChange={(e) => setcategory(e.target.value)}
                        className="capitalize"
                      >
                        {categorys.map((cate: any, index: number) => (
                          <option  key={index} value={cate?.mainCode_value}>
                            {cate?.mainCode_value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Product name
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

                  <div className="mb-4">
                    <label htmlFor="urlImage" className="form-label">
                      url Image
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="urlImage"
                      value={urlImage}
                      onChange={(e) => setUrlImage(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    {isLoadingUploadUrl ? (
                      <LoadingButton />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onUploadImgUrl();
                        }}
                        disabled={!urlImage}
                        type="submit"
                        className="btn btn-primary"
                      >
                        Upload Url Image
                      </button>
                    )}
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

export default AddProductMain;
