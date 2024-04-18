import "./styles.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProductsDetailQuery,
  useGetPublishedProductsQuery,
} from "../../store/components/products/productsApi";
import { PAGE_SIZE } from "../../utils/constants";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { useDispatch } from "react-redux";
import ProductsRender from "./ProductsRender";

const ShopDetailSection = ({
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

      const urls: any = [];

      const productsArr = dataProducts?.metadata?.products ?? [];
      if (Array.isArray(productsArr) && productsArr.length > 0) {
        productsArr.map((product) => {
          urls.push("http://localhost:5000/api/products/detail/" + product._id);
        });
        // const zz = concurrencyRequest(urls, 3);
      }
    }
  }, [dataProducts]);
  const userInfo = useSelector(getUserInfo);

  const concurrencyRequest = async (urls: any, maxNum: any) => {
    if (urls.length === 0) {
      // Nếu danh sách URLs trống, resolve ngay lập tức với mảng kết quả trống
      return Promise.resolve([]);
    }

    const results: any = []; // Mảng kết quả từ các yêu cầu
    let index = 0; // Chỉ số của URL đang được xử lý
    let count = 0; // Số lượng yêu cầu đã hoàn thành

    async function request() {
      if (index === urls.length) return; // Nếu đã xử lý tất cả các URL, thoát khỏi hàm

      const i = index; // Lưu chỉ số để sử dụng trong async function
      const url = urls[index++]; // Lấy URL và tăng chỉ số

      try {
        // Thực hiện yêu cầu fetch và lưu kết quả vào mảng
        results[i] = await fetch(url);
      } catch (err) {
        // Nếu có lỗi, lưu lỗi vào mảng kết quả
        results[i] = err;
      } finally {
        // Tăng biến đếm và kiểm tra hoàn thành tất cả các yêu cầu
        if (++count === urls.length) {
          console.log("Hoàn thành tất cả yêu cầu");
          return Promise.resolve(results);
        }

        // Đặt thời gian chờ 1 giây và sau đó gọi lại hàm yêu cầu
        setTimeout(request, 1000);
      }
    }

    const maxConcurrency = Math.min(maxNum, urls.length); // Số lần yêu cầu tối đa có thể được thực hiện đồng thời
    // Bắt đầu thực hiện yêu cầu đồng thời
    const zzz = Array.from({ length: maxConcurrency }, () => setTimeout(request, 1000));
    // console.log(`:::zzz::`, zzz);
  };
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

export default ShopDetailSection;
