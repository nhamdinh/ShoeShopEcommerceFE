import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDraftProductsQuery } from "../../store/components/products/productsApi";
import { PAGE_SIZE } from "../../utils/constants";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { useDispatch } from "react-redux";
import ProductsRender from "../homeComponents/ProductsRender";

const DraftProducts = ({
  pagenumber,
  keyword,
  brand,
  shopId,
  productShop,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);

  const [dataFetched, setdataFetched] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [total, setTotal] = useState<any>(1);

  const {
    data: dataProducts,
    error,
    isSuccess,
    isFetching,
  } = useGetDraftProductsQuery(
    {
      product_shop: shopId,
      limit: PAGE_SIZE,
      page: pagenumber ?? 1,
      orderByKey: "_id",
      orderByValue: -1,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      const { products = [], totalPages, page } = dataProducts?.metadata;
      setdataFetched(products);
      setTotal(totalPages);
      setCurrentPage(page);
    }
  }, [dataProducts]);

  return (
    <ProductsRender
      isLoading={isFetching}
      keyword={keyword}
      brand={brand}
      error={error}
      productShop={productShop}
      dataFetched={dataFetched}
      userInfo={userInfo}
      total={total}
      currentPage={currentPage}
    ></ProductsRender>
  );
};

export default DraftProducts;
