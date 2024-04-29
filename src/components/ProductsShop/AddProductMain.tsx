import "./style.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { FOLDER_PRODUCS_STORAGE } from "../../utils/constants";
import {
  useCreateProductMutation,
  useUploadImgMutation,
  useUploadImgUrlMutation,
  useGetAllBrandByCategoriesMutation,
} from "../../store/components/products/productsApi";
import { Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import LoadingButton from "../LoadingError/LoadingButton";
import SelectCategories from "../../ui/SelectCategories";
import SelectApp from "../../ui/SelectApp";
import VariantItem from "./components/VariantItem";
import TableCreateSku from "./components/TableCreateSku";
import { formatMoney } from "../../utils/commonFunction";

const SIZE = 5;
const sizeMax = SIZE * 1000 * 1000;

const VARIANT = {
  images: [],
  name: "",
  values: [""],
};

const AddProductMain = ({ userInfo }: any) => {
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState<any>([]);
  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [image, setImage] = useState<any>("");
  const [urlImage, setUrlImage] = useState<any>("");
  const [product_thumb_small, setProduct_thumb_small] = useState<any>("");
  const [countInStock, setCountInStock] = useState<any>(0);
  const [description, setDescription] = useState<any>("");
  const [brand, setBrand] = useState<any>(null);
  const [brands, setBrands] = useState<any>([]);
  const [productVariants, setProductVariants] = useState<any>([
    // {
    //   images: [],
    //   name: "color",
    //   values: ["red", "green", "blue"],
    //   id: Date.now() + 888844,
    // },
    // {
    //   images: [],
    //   name: "size",
    //   values: ["X", "M", "L"],
    //   id: Date.now(),
    // },
    {
      ...VARIANT,
      id: Date.now(),
    },
  ]);
  const [dataTableDisplay, setDataTableDisplay] = useState<any>([]);

  const [cateArr, setCateArr] = useState<any>([]);

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

  const [uploadImg, { isLoading: isLoadingUpload }] = useUploadImgMutation();
  const [uploadImgUrl, { isLoading: isLoadingUploadUrl }] =
    useUploadImgUrlMutation();

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const sizeImg = file ? +file?.size : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);

      await uploadImg({
        formData,
        folder: FOLDER_PRODUCS_STORAGE,
      })
        .then((res: any) => {
          const data = res?.data?.metadata;
          if (data) handleImageAttribute(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFileList([]);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "File is so Big, must less than 5MB",
          step: 2,
        })
      );
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

  const checkVariantsName = (__productVariants: any) => {
    let __variants = [...__productVariants];
    const variantArr = __productVariants.filter((vvv: any) => vvv.name === "");

    if (variantArr.length === 0)
      __variants.push({
        ...VARIANT,
        id: Date.now(),
      });

    if (variantArr.length === 2) {
      __variants = __productVariants.filter((vvv: any) => vvv.name !== "");
      __variants.push({
        ...VARIANT,
        id: Date.now(),
      });
    }
    return __variants;
  };

  const checkVariantsValues = (__variantValues: any) => {
    let __values = [...__variantValues];

    const variantArr = __variantValues.filter((vvv: any) => vvv === "");

    if (variantArr.length === 0) __values.push("");

    if (variantArr.length === 2) {
      __values = __variantValues.filter((vvv: any) => vvv !== "");
      __values.push("");
    }
    return __values;
  };

  const handleChangeVariants = (id: any, key: any, value: any) => {
    const foundVariant = productVariants.find((vvv: any) => vvv.id === id);
    if (foundVariant) {
      const __productVariants = productVariants.map((pv: any) => {
        if (foundVariant.id === pv.id) {
          foundVariant[key] = value;
          foundVariant.values = checkVariantsValues(foundVariant.values);
          return foundVariant;
        }
        return pv;
      });

      setProductVariants(checkVariantsName(__productVariants));
    }
  };

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
    const product_variants = productVariants
      .filter((pp: any) => pp.name && pp.values.length > 1)
      .map((kk: any) => {
        const final: any = { ...kk };
        final.values = kk.values.filter((vv: any) => vv !== "");
        delete final["id"]
        return final;
      });
    const sku_list = dataTableDisplay
      .filter((pp: any) => pp.sku_price && pp.sku_stock)
      .map((sku: any) => {
        const { sku_price, sku_stock, sku_tier_index } = sku;
        const sku_values = { ...sku };
        ["id", "sku_price", "sku_stock", "sku_tier_index"].map((key) => {
          delete sku_values[key];
        });
        return { sku_price, sku_stock, sku_tier_index, sku_values };
      });
    if (
      product_variants.length &&
      sku_list.length &&
      image &&
      brand &&
      cateArr.length
    ) {
      onCreateProduct({
        product_name: name,
        product_description: description,
        product_thumb: image,
        product_thumb_small,
        product_price: price,
        product_original_price: +(
          (+price * (Math.random() * (50 - 10) + 10 + 100)) /
          100
        ).toFixed(2),
        product_quantity: countInStock,
        product_brand: brand,
        product_categories: cateArr,
        product_shop: userInfo._id,
        product_variants,
        // product_variants: [
        //   {
        //     images: [],
        //     name: "color",
        //     values: ["red", "green", "blue"],
        //   },
        //   {
        //     images: [],
        //     name: "size",
        //     values: ["X", "M", "L"],
        //   },
        // ],
        sku_list,
        // sku_list: [
        //   {
        //     sku_tier_index: [0, 0],
        //     sku_price: 87,
        //     sku_stock: 10,
        //   },
        //   {
        //     sku_tier_index: [0, 1],
        //     sku_price: 88,
        //     sku_stock: 23,
        //   },
        //   {
        //     sku_tier_index: [1, 0],
        //     sku_price: 89,
        //     sku_stock: 56,
        //   },
        //   {
        //     sku_tier_index: [1, 1],
        //     sku_price: 90,
        //     sku_stock: 58,
        //   },
        // ],
        product_attributes: [
          {
            attribute_id: "abc123",
            attribute_values: [
              {
                value_id: "value11",
              },
              {
                value_id: "value2",
              },
            ],
          },
        ],
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

  const onUploadImgUrl = async () => {
    await uploadImgUrl({
      urlImage,
    })
      .then((res: any) => {
        const data = res?.data?.metadata;
        if (data) handleImageAttribute(data);
      })
      .catch((err: any) => {
        console.error(err);
      });
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
                      <h6>Categories</h6>
                      <SelectCategories
                        cb_setBrands={(val: any) => {
                          setBrands(val);
                        }}
                        cb_setBrand={(val: any, cateArr: any) => {
                          setBrand(val);
                          setCateArr(cateArr);
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

                      {/* <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="capitalize"
                      >
                        {brands.map((br: any, index: number) => (
                          <option key={index} value={br?.brand}>
                            {br?.brand}
                          </option>
                        ))}
                      </select> */}

                      {/* <select
                        value={cateArr}
                        onChange={(e) => setCateArr(e.target.value)}
                        className="capitalize"
                      >
                        {categories.map((cate: any, index: number) => (
                          <option key={index} value={cate?.mainCode_value}>
                            {cate?.mainCode_value}
                          </option>
                        ))}
                      </select> */}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="product_title"
                      className="form-label underline fw600"
                    >
                      Product Options
                    </label>
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

                  {productVariants.map((vvv: any, index: number) => {
                    return (
                      <VariantItem
                        index={index}
                        key={vvv?.id}
                        variantItem={vvv}
                        cb_setProduct_variants={(
                          id: any,
                          key: any,
                          value: any
                        ) => {
                          handleChangeVariants(id, key, value);
                        }}
                      />
                    );
                  })}

                  <TableCreateSku
                    productVariants={productVariants}
                    dataTableDisplay={dataTableDisplay}
                    cb_setDataTableDisplay={(val: any) => {
                      setDataTableDisplay(val);
                    }}
                    cb_setPrice={(val: any) => {
                      setPrice(val);
                    }}
                    cb_setCountInStock={(val: any) => {
                      setCountInStock(val);
                    }}
                  />
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Price
                    </label>
                    <input
                      // type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={formatMoney(price)}
                      readOnly={true}

                      // onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Count In Stock
                    </label>
                    <input
                      // type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_price"
                      required
                      value={formatMoney(countInStock)}
                      readOnly={true}
                      // onChange={(e) => setCountInStock(e.target.value)}
                    />
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
