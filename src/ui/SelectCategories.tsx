import { memo, useEffect, useState } from "react";
import SelectAppMultiple from "./SelectAppMultiple";
import { PRODUCT_CATEGORY } from "../utils/constants";
import { useGetCodesQuery } from "../store/components/products/productsApi";

const SelectCategories = ({
  cb_onGetAllBrandByCategories,
  cb_setCateArr,
  cb_resetBrands,
  cateArr = [],
}: any) => {
  // const [cateArr, setCateArr] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (cateArr.length) {
      cb_onGetAllBrandByCategories({
        ids: cateArr,
      });
    }
  }, [cateArr]);

  const {
    data: dataFetch,
    error,
    isSuccess,
    isFetching,
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
    if (isSuccess) {
      const { mainCodes = [] } = dataFetch?.metadata;
      const __mainCodes = mainCodes.map((mm: any) => {
        return {
          value: mm._id,
          label: mm.mainCode_value,
        };
      });
      setCategories(__mainCodes);
    }
  }, [dataFetch]);

  const handleChange = (value: string | string[]) => {
    if (value.length < 4) {
      cb_setCateArr(value);
      cb_resetBrands();
    }
  };

  return (
    <SelectAppMultiple
      options={categories}
      value={cateArr}
      cb_setValue={handleChange}
      placeholder={"Please select (Max 3)"}
      width={"320px"}
    />
  );
};
export default memo(SelectCategories);
