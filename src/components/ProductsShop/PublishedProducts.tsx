import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPublishedProductsQuery } from "../../store/components/products/productsApi";
import { PAGE_SIZE } from "../../utils/constants";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { useDispatch } from "react-redux";
import ProductsRender from "../homeComponents/ProductsRender";

const PublishedProducts = ({
  pagenumber,
  keyword,
  brand,
  shopId,
  productShop,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataFetched, setdataFetched] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [total, setTotal] = useState<any>(1);

  const [params, setParams] = useState<any>({
    page: pagenumber ?? 1,
    keyword: keyword ?? "",
    brand: brand ?? "",
    limit: PAGE_SIZE,
    order: "desc",
    orderBy: "createdAt",
  });

  useEffect(() => {
    setParams({
      ...params,
      page: pagenumber ?? 1,
      keyword: keyword ?? "",
      brand: brand ?? "",
    });
  }, [pagenumber, keyword, brand]);

  const {
    data: dataProducts,
    error,
    isSuccess,
    isLoading,
  } = useGetPublishedProductsQuery(
    {
      product_shop: shopId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    if (isSuccess) {
      setdataFetched(dataProducts?.metadata?.products);
      setTotal(dataProducts?.totalPages);
      setCurrentPage(dataProducts?.page);
    }
  }, [dataProducts]);
  const userInfo = useSelector(getUserInfo);

  return (
    <ProductsRender
      isLoading={isLoading}
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

export default PublishedProducts;
