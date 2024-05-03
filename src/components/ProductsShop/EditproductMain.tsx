import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { PRODUCT_CATEGORY } from "../../utils/constants";
import {
  useGetAllBrandByCategoriesMutation,
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

  const [fileList, setFileList] = useState<any>([]);

  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [priceMax, setPriceMax] = useState<any>(0);
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
    const {
      product_name,
      product_description,
      product_price,
      product_thumb,
      product_thumb_small,
      product_quantity,
      product_categories,
      product_brand,
    } = product;

    console.log(product);

    setName(product_name);
    setDescription(product_description);
    setImage(product_thumb);
    setProduct_thumb_small(product_thumb_small);
    setFileList([{ url: product_thumb }]);

    setPrice(product_price);
    setCountInStock(product_quantity);

    setCateArr(product_categories);
    setBrand(product_brand);
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
    if (
      // product_variants.length &&
      // sku_list.length &&
      image &&
      name &&
      brand &&
      cateArr.length
    ) {
      onUpdateProduct({
        productId: productId,
        product_name: name,
        product_description: description,
        product_thumb: image,
        product_thumb_small,
        // product_price: price,
        // product_original_price: +(
        //   (+priceMax * (Math.random() * (50 - 10) + 10 + 100)) /
        //   100
        // ).toFixed(2),
        // product_quantity: countInStock,
        product_brand: brand,
        product_categories: cateArr,
        // product_type: categor,
        // product_attributes: [
        //   {
        //     attribute_id: "abc123",
        //     attribute_values: [
        //       {
        //         value_id: "value11",
        //       },
        //       {
        //         value_id: "value2",
        //       },
        //     ],
        //   },
        // ],
      });
    } else {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "Please enter complete information!",
          step: 2,
        })
      );
    }
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
                    Update now
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
                                cb_resetBrands={() => {
                                  setBrand(null);
                                  setBrands([]);
                                }}
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
                              Product Sku
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
