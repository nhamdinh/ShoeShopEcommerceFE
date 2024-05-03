import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { PRODUCT_CATEGORY } from "../../utils/constants";
import {
  useGetAllBrandByCategoriesMutation,
  useGetBrandsQuery,
  useGetCodesQuery,
  useGetProductsDetailQuery,
  useUpdateProductMutation,
} from "../../store/components/products/productsApi";
import { useLocation } from "react-router-dom";
import { openToast } from "../../store/components/customDialog/toastSlice";
import { getUserInfo } from "../../store/selector/RootSelector";
import DocumentTitle from "../DocumentTitle";
import SelectCategories from "../../ui/SelectCategories";
import SelectApp from "../../ui/SelectApp";
import UploadAntd from "../../ui/UploadAntd";
import UploadByUrl from "../../ui/UploadByUrl";

const EditProductMain = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const location = useLocation();
  const [productId, setProductId] = useState<any>(
    location.pathname.split("/")[2]
  );

  const [brand, setBrand] = useState<any>(null);
  const [brands, setBrands] = useState<any>([]);
  const [cateArr, setCateArr] = useState<any>([]);

  const [categor, setcategory] = useState<any>("");
  const [categorys, setcategorys] = useState<any>([]);

  const [fileList, setFileList] = useState<any>([]);

  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>("0");
  const [image, setImage] = useState<any>("");
  const [product_thumb_small, setProduct_thumb_small] = useState<any>("");
  const [countInStock, setCountInStock] = useState<any>(0);
  const [description, setDescription] = useState<any>("");

  const [product, setDataFetched] = useState<any>({});
  const {
    data: dataFetch,
    error,
    isSuccess,
    isFetching,
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
    if (isSuccess) setDataFetched(dataFetch?.metadata);
  }, [dataFetch]);

  useEffect(() => {
    setName(product?.product_name);
    setDescription(product?.product_description);
    setPrice(product?.product_price);

    setImage(product?.product_thumb);
    setProduct_thumb_small(product?.product_thumb_small);
    setFileList([{ url: product?.product_thumb }]);

    setCountInStock(product?.product_quantity);
    setcategory(product?.product_type);
    setBrand(product?.product_attributes?.brand);
  }, [product]);

  const handleImageAttribute = (data: any) => {
    setFileList([
      {
        url: data?.url,
      },
    ]);
    setImage(data?.url);
    setProduct_thumb_small(data?.thumb_url);
  };

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
      const dataBrands = brandsdata?.metadata.brands;
      const __dataBrands = dataBrands.map((mm: any) => {
        return {
          value: mm._id,
          label: mm.brand,
        };
      });
      console.log(__dataBrands);
      // setBrands(__dataBrands);
      // setBrand(__dataBrands[0]?.value);
    }
  }, [brandsdata]);

  const {
    data,
    error: categoryserror,
    isSuccess: isSuccesscategorys,
    isLoading: isLoadingcategorys,
  } = useGetCodesQuery(
    {
      mainCode_type: PRODUCT_CATEGORY,
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

  useEffect(() => {
    setProductId(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const [
    updateProduct,
    { isLoading: LoadingupdateProduct, error: errorupdateProduct },
  ] = useUpdateProductMutation();

  const onUpdateProduct = async (values: any) => {
    await updateProduct(values)
      .then((res: any) => {
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
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onUpdateProduct({
      productId: productId,
      product_name: name,
      product_description: description,
      product_price: price,
      product_original_price: +(
        (+price * (Math.random() * (50 - 10) + 10 + 100)) /
        100
      ).toFixed(2),
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

  const [getAllBrandByCategories, { isLoading: illz, error: errz }] =
    useGetAllBrandByCategoriesMutation();

  const onGetAllBrandByCategories = async (values: any) => {
    await getAllBrandByCategories(values)
      .then((res: any) => {
        const data = res?.data;
        if (data) {
          const dataBrands = data?.metadata.brands;
          const __dataBrands = dataBrands.map((mm: any) => {
            return {
              value: mm._id,
              label: mm.brand,
            };
          });
          setBrands(__dataBrands);
        } else {
          setBrands([]);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setBrand(null);
    setBrands([]);
  }, [cateArr]);

  return (
    <>
      <DocumentTitle title={"Edit Product"}></DocumentTitle>
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
                      {(LoadingupdateProduct || isFetching) && <Loading />}
                      {error ? (
                        <Message variant="alert-danger" mess={error}></Message>
                      ) : (
                        <>
                          <div className="mb-4">
                            <div className="flex-box d-flex justify-content-between align-items-center">
                              <h6>Categories</h6>
                              <SelectCategories
                                cateArr={cateArr}
                                cb_setCateArr={(val: any) => {
                                  setCateArr(val);
                                }}
                                cb_onGetAllBrandByCategories={(val: any) => {
                                  onGetAllBrandByCategories(val);
                                }}
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex-box d-flex justify-content-between align-items-center">
                              <h6>Brand</h6>
                              <SelectApp
                                options={brands}
                                value={brand}
                                cb_setValue={(value: any, opt: any) => {
                                  setBrand(value);
                                }}
                                width={"140px"}
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="form-label underline fw600">
                              Product Options
                            </div>
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="product_title"
                              className="form-label"
                            >
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
                              readOnly={true}
                              // onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="product_countInStock"
                              className="form-label"
                            >
                              Count In Stock
                            </label>
                            <input
                              type="number"
                              placeholder="Type here"
                              className="form-control"
                              id="product_countInStock"
                              required
                              value={countInStock}
                              readOnly={true}
                              // onChange={(e) => setCountInStock(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="product_description"
                              className="form-label"
                            >
                              Description
                            </label>
                            <textarea
                              id="product_description"
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
                            <UploadAntd
                              fileList={fileList}
                              cb_handleImageAttribute={(data: any) => {
                                handleImageAttribute(data);
                              }}
                              cb_setFileList={(data: any) => {
                                setFileList(data);
                              }}
                            ></UploadAntd>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="urlImage" className="form-label">
                              url Image
                            </label>
                            <UploadByUrl
                              cb_handleImageAttribute={(data: any) => {
                                handleImageAttribute(data);
                              }}
                            ></UploadByUrl>
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
