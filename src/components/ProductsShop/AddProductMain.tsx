import "./style.scss";
import { uid } from "uid";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import {
  useCreateProductMutation,
  useGetAllBrandByCategoriesMutation,
  useUploadImgMutation,
} from "../../store/components/products/productsApi";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/components/customDialog/toastSlice";
import SelectCategories from "../../ui/SelectCategories";
import SelectApp from "../../ui/SelectApp";
import VariantItem from "./components/VariantItem";
import TableCreateSku from "./components/TableCreateSku";
import { countOccurrences, formatMoney } from "../../utils/commonFunction";
import UploadAntd from "../../ui/UploadAntd";
import UploadByUrl from "../../ui/UploadByUrl";
import { FOLDER_PRODUCS_STORAGE } from "../../utils/constants";

const VARIANT = {
  images: [],
  name: "",
  values: [""],
};

const AddProductMain = ({ userInfo }: any) => {
  const dispatch = useDispatch();

  /*  */
  const [urls, setUrls] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  const [fileList2, setFileList2] = useState<any>([]);
  const [fileList3, setFileList3] = useState<any>([]);
  const [fileList4, setFileList4] = useState<any>([]);
  /*  */
  const [name, setName] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [priceMax, setPriceMax] = useState<any>(0);
  const [image, setImage] = useState<any>("");
  const [product_thumb_small, setProduct_thumb_small] = useState<any>("");
  const [countInStock, setCountInStock] = useState<any>(0);
  const [description, setDescription] = useState<any>("");
  const [brand, setBrand] = useState<any>(null);
  const [brands, setBrands] = useState<any>([]);
  const [cateArr, setCateArr] = useState<any>([]);

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
      id: uid() + Date.now(),
    },
  ]);
  const [dataTableDisplay, setDataTableDisplay] = useState<any>([]);

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

  const checkVariantsName = (__productVariants: any) => {
    let __variants = [...__productVariants];
    const variantArr = __productVariants.filter((vvv: any) => vvv.name === "");

    if (variantArr.length === 0)
      __variants.push({
        ...VARIANT,
        id: uid() + Date.now(),
      });

    if (variantArr.length === 2) {
      __variants = __productVariants.filter((vvv: any) => vvv.name !== "");
      __variants.push({
        ...VARIANT,
        id: uid() + Date.now(),
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
      setPriceMax(0);
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
    const product_description = editorRef?.current?.getContent();
    const images: any = Object.keys(urls).map((key) => urls[key]);

    const product_variants = productVariants
      .filter((pp: any) => pp.name && pp.values.length > 1)
      .map((kk: any) => {
        const final: any = { ...kk };
        final.values = kk.values.filter((vv: any) => vv !== "");
        delete final["id"];
        return final;
      });

    const sku_list = dataTableDisplay
      .filter((pp: any) => pp.sku_price && pp.sku_stock)
      .map((sku: any) => {
        const { sku_price, sku_stock, sku_tier_index } = sku;
        const sku_values = { ...sku };
        ["id", "_id", "sku_price", "sku_stock", "sku_tier_index"].map((key) => {
          delete sku_values[key];
        });
        return { sku_price, sku_stock, sku_tier_index, sku_values };
      });

    /* check double value */
    const countValue = countOccurrences(
      product_variants.map((vv: any) => vv?.name.trim())
    );
    const hasDouble = Object.keys(countValue).find(
      (vv: any) => countValue[vv] > 1
    );
    if (hasDouble) {
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: `Option ${hasDouble} has been duplicate !!`,
          step: 2,
        })
      );
      return;
    }

    for (let oo in product_variants) {
      const countValue = countOccurrences(product_variants[oo]?.values);
      const hasDouble = Object.keys(countValue).find(
        (vv: any) => countValue[vv] > 1
      );
      if (hasDouble) {
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: `${product_variants[oo]?.name} has duplicate value ${hasDouble} !!`,
            step: 2,
          })
        );
        return;
      }
    }
    /* check double value */

    if (
      product_variants.length &&
      sku_list.length &&
      name &&
      image &&
      brand &&
      cateArr.length
    ) {
      onCreateProduct({
        product_name: name,
        product_description,
        product_images: images,
        product_thumb: image,
        product_thumb_small,
        product_price: price,
        product_original_price: +(
          (+priceMax * (Math.random() * (50 - 10) + 10 + 100)) /
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

  const handleImageAttribute = (data: any, index: number) => {
    if (index === 1) {
      setFileList([
        {
          url: data?.url,
        },
      ]);
      setImage(data?.url);
      setProduct_thumb_small(data?.thumb_url);
      return;
    }
    if (index === 2) {
      setFileList2([
        {
          url: data?.url,
        },
      ]);
      setUrls((prev: any) => ({
        ...prev,
        url2: data?.url,
      }));
      return;
    }
    if (index === 3) {
      setFileList3([
        {
          url: data?.url,
        },
      ]);
      setUrls((prev: any) => ({
        ...prev,
        url3: data?.url,
      }));
      return;
    }
    if (index === 4) {
      setFileList4([
        {
          url: data?.url,
        },
      ]);
      setUrls((prev: any) => ({
        ...prev,
        url4: data?.url,
      }));
      return;
    }
  };

  useEffect(() => {
    if (!fileList.length) {
      setImage("");
      setProduct_thumb_small("");
    }
  }, [fileList]);

  useEffect(() => {
    const final: any = { ...urls };
    if (!fileList2.length) {
      delete final["url2"];
    }
    if (!fileList3.length) {
      delete final["url3"];
    }
    if (!fileList4.length) {
      delete final["url4"];
    }
    setUrls(final);
  }, [fileList2, fileList3, fileList4]);

  const editorRef: any = useRef(null);

  const [uploadImg, { isLoading: isLoadingUpload }] = useUploadImgMutation();

  const uploadImageHandler = (blobInfo: any, progress: any) =>
    new Promise<string>(async (resolve, reject) => {
      try {
        const formData = new FormData();
        const fileName = uid() + Date.now();

        formData.append("name", fileName);
        formData.append("file", blobInfo.blob());

        await uploadImg({
          formData,
          folder: FOLDER_PRODUCS_STORAGE,
        })
          .then((res: any) => {
            const data = res?.data?.metadata;
            return resolve(data?.url);
          })
          .catch((err) => {
            console.log(err);
            return reject("Something went wrong!");
          });
      } catch (error) {
        return reject("Something went wrong!");
      }
    });

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
                    <label htmlFor="product_description" className="form-label">
                      Description
                    </label>

                    <div className="editor">
                      <div className="editor-row">
                        <Editor
                          onInit={(_, editor) => (editorRef.current = editor)}
                          apiKey="ytlxyafeoqebwontx5k6jihqppqg5atb3ke3uch14g6p7r13"
                          // initialValue={medicalReply ? medicalReply?.content : ''}
                          initialValue={""}
                          plugins="advlist autolink lists link image charmap preview 
                              searchreplace visualblocks code fullscreen
                                paste code help wordcount media"
                          init={{
                            toolbar:
                              "undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | image | media",
                            placeholder: "Description",
                            images_upload_handler: uploadImageHandler,
                          }}
                        />
                      </div>
                    </div>

                    {/*                     <textarea
                      id="product_description"
                      placeholder="Type here"
                      className="form-control"
                      rows={7}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea> */}
                  </div>
                  <div className="mb-4">
                    <div className="form-label underline fw600">
                      Product Sku
                    </div>
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
                      setPrice(+val);
                    }}
                    cb_setPriceMax={(max: any) => {
                      setPriceMax(+max);
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
                    <label
                      htmlFor="product_countInStock"
                      className="form-label"
                    >
                      Count In Stock
                    </label>
                    <input
                      // type="number"
                      placeholder="Type here"
                      className="form-control"
                      id="product_countInStock"
                      required
                      value={formatMoney(countInStock)}
                      readOnly={true}
                      // onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Images</label>
                    <div className="row">
                      <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12">
                        <UploadAntd
                          fileList={fileList}
                          cb_handleImageAttribute={(data: any) => {
                            handleImageAttribute(data, 1);
                          }}
                          cb_setFileList={(data: any) => {
                            setFileList(data);
                          }}
                        />
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12">
                        <UploadAntd
                          fileList={fileList2}
                          cb_handleImageAttribute={(data: any) => {
                            handleImageAttribute(data, 2);
                          }}
                          cb_setFileList={(data: any) => {
                            setFileList2(data);
                          }}
                        />
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12">
                        <UploadAntd
                          fileList={fileList3}
                          cb_handleImageAttribute={(data: any) => {
                            handleImageAttribute(data, 3);
                          }}
                          cb_setFileList={(data: any) => {
                            setFileList3(data);
                          }}
                        />
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12">
                        <UploadAntd
                          fileList={fileList4}
                          cb_handleImageAttribute={(data: any) => {
                            handleImageAttribute(data, 4);
                          }}
                          cb_setFileList={(data: any) => {
                            setFileList4(data);
                          }}
                        />
                      </div>
                    </div>

                    {/* <UploadAntd
                      fileList={fileList}
                      cb_handleImageAttribute={(data: any) => {
                        handleImageAttribute(data);
                      }}
                      cb_setFileList={(data: any) => {
                        setFileList(data);
                      }}
                    ></UploadAntd> */}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="urlImage" className="form-label">
                      url Image
                    </label>

                    <UploadByUrl
                      cb_handleImageAttribute={(data: any) => {
                        handleImageAttribute(data, 1);
                      }}
                    ></UploadByUrl>
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
