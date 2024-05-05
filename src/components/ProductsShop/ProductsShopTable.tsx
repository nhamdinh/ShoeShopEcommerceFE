import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPublishedProductsQuery } from "../../store/components/products/productsApi";
import { PAGE_SIZE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { Checkbox } from "antd";
import { toNonAccentVietnamese } from "../../utils/commonFunction";

const ProductsShopTable = ({
  pagenumber,
  brand,
  shopId,
  setproductIds,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdown, setdropdown] = useState<any>(false);
  const [keyword, setKeyword] = useState<any>("");

  const [dataFetched, setdataFetched] = useState<any>([]);

  useEffect(() => {
    const productIds_temp: any = [];
    dataFetched.map((data: any) => {
      if (data?.checked) {
        productIds_temp.push(data?._id);
      }
    });
    setproductIds(productIds_temp);
  }, [dataFetched]);

  const {
    data: dataProducts,
    error,
    isSuccess,
    isFetching,
  } = useGetPublishedProductsQuery(
    {
      product_shop: shopId,
      limit: 999,
      page: 1,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      const { products = [] } = dataProducts?.metadata;
      setdataFetched(
        products.map((data: any, index: number) => {
          return { ...data, checked: false, index: index + 1 };
        })
      );
    }
  }, [dataProducts]);

  return (
    <div className="">
      <div className="mb-4">
        <div className="flex-box d-flex justify-content-between align-items-center gap10px">
          <h6 className="form-label">discount_productIds</h6>

          <div className="input-group">
            <input
              type="search"
              className="form-control rounded search"
              placeholder="Search"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setdropdown(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setdropdown(false);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex-box d-flex justify-content-between align-items-center gap10px">
          <div className="ProductsShopTable">
            {dataFetched
              .filter((item: any) => {
                const searchTerm = toNonAccentVietnamese(keyword.toLowerCase());
                const fullName = toNonAccentVietnamese(
                  item?.product_name.toLowerCase()
                );
                // console.log(searchTerm);
                // console.log(fullName);
                return fullName.includes(searchTerm) && fullName !== searchTerm;
              })
              .map((item: any, index: number) => {
                return (
                  <div className="ProductsShopTable__row" key={index}>
                    <Checkbox
                      checked={item?.checked}
                      onChange={(e) => {
                        let dataFetched_temp: any = [...dataFetched];
                        dataFetched_temp.map((data: any) => {
                          if (item?._id === data?._id) {
                            data.checked = !data.checked;
                          }
                        });
                        setdataFetched(dataFetched_temp);
                      }}
                    ></Checkbox>
                    <div className="name">{item?.index}.</div>
                    <div
                      className="dropdown-row"
                      onClick={(e) => {
                        e.stopPropagation();
                        // submitHandler(item?.name, brand);
                      }}
                      key={item?._id}
                    >
                      <div className="name">{item?.product_name}</div>
                      <img
                        loading="lazy"
                        src={item?.product_thumb_small ?? item?.product_thumb}
                        alt="product_thumb"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsShopTable;
