import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { FOLDER_PRODUCS_STORAGE } from "../../utils/constants";
import {
  useGetBrandsQuery,
  useGetCodesQuery,
  useGetProductsDetailQuery,
  useUpdateProductMutation,
  useUploadImgMutation,
  useUploadImgUrlMutation,
} from "../../store/components/products/productsApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { openToast } from "../../store/components/customDialog/toastSlice";
import { getUserInfo } from "../../store/selector/RootSelector";
import LoadingButton from "../LoadingError/LoadingButton";

const SIZE = 5;
const sizeMax = SIZE * 1000 * 1000;

const EditProductMain = () => {
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

  const handleImageAttribute = (data: any) => {
    setFileList([
      {
        url: data?.url,
      },
    ]);
    setImage(data?.url);
    setProduct_thumb_small(data?.thumb_url);
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
    }
  }, [brandsdata]);

  const [categor, setcategory] = useState<any>("");
  const [categorys, setcategorys] = useState<any>([]);

  const {
    data,
    error: categoryserror,
    isSuccess: isSuccesscategorys,
    isLoading: isLoadingcategorys,
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
      setcategorys(data?.metadata?.mainCodes);
      setcategory(data?.metadata?.mainCodes[0]?.mainCode_value);
    }
  }, [data]);

  const location = useLocation();
  const [productId, setproductId] = useState<any>(
    location.pathname.split("/")[2]
  );
  useEffect(() => {
    setproductId(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const [product, setdataFetched] = useState<any>({});
  const {
    data: dataFetch,
    error,
    isSuccess,
    isLoading,
  } = useGetProductsDetailQuery(
    {
      id: productId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataFetch?.metadata);
    }
  }, [dataFetch]);

  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>("0");
  const [image, setImage] = useState<any>("");
  const [urlImage, setUrlImage] = useState<any>("");
  const [product_thumb_small, setProduct_thumb_small] = useState<any>("");
  const [countInStock, setCountInStock] = useState<any>(0);
  const [description, setDescription] = useState<any>("");

  const [
    updateProduct,
    { isLoading: LoadingupdateProduct, error: errorupdateProduct },
  ] = useUpdateProductMutation();

  const onUpdateProduct = async (values: any) => {
    const res = await updateProduct(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Updated Product Success",
          step: 1,
        })
      );
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Update Product Failed",
          step: 2,
        })
      );
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onUpdateProduct({
      productId: productId,
      product_name: name,
      product_description: description,
      product_price: price,
      product_thumb: image,
      product_thumb_small,
      product_quantity: countInStock,
      product_type: categor,
      product_attributes: {
        brand: brand,
        size: "10inch",
        material: "gold",
      },
    });
  };

  useEffect(() => {
    setName(product?.product_name);
    setDescription(product?.product_description);
    setPrice(product?.product_price);

    setImage(product?.product_thumb);
    setProduct_thumb_small(product?.product_thumb_small);
    setFileList([{ url: product?.product_thumb }]);
    
    setCountInStock(product?.product_quantity);
    setcategory(product?.product_type);
    setbrand(product?.product_attributes?.brand);
  }, [product]);
  const userInfo = useSelector(getUserInfo);

  return (
    <>
      <div className="container mt-lg-5 mt-3">
        <div className="row align-items-start">
          <div className="col-lg-4 p-0 shadow "></div>

          {/* panels */}

          <section className="content-main" style={{ maxWidth: "1200px" }}>
            <form onSubmit={submitHandler}>
              <div className="content-header">
                <Link
                  to={`/shop/${userInfo._id}`}
                  className="btn btn-danger text-white"
                >
                  Go to products
                </Link>
                <h2 className="content-title">Update Product</h2>
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
                      {errorupdateProduct && (
                        <Message
                          variant="alert-danger"
                          mess={errorupdateProduct}
                        ></Message>
                      )}
                      {LoadingupdateProduct && <Loading />}
                      {isLoading ? (
                        <Loading />
                      ) : error ? (
                        <Message variant="alert-danger" mess={error}></Message>
                      ) : (
                        <>
                          <div className="mb-4">
                            <div className="flex-box d-flex justify-content-between align-items-center">
                              <h6>Brand</h6>
                              <select
                                value={brand}
                                onChange={(e) => setbrand(e.target.value)}
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
                                disabled
                                onChange={(e) => setcategory(e.target.value)}
                              >
                                {categorys.map((cate: any, index: number) => (
                                  <option
                                    key={index}
                                    value={cate?.mainCode_value}
                                  >
                                    {cate?.mainCode_value}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="product_title"
                              className="form-label"
                            >
                              Product title
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
                            <label
                              htmlFor="product_price"
                              className="form-label"
                            >
                              Price
                            </label>
                            <input
                              type="text"
                              placeholder="Type here"
                              className="form-control"
                              id="product_price"
                              required
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="product_price"
                              className="form-label"
                            >
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
                              required
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default EditProductMain;
