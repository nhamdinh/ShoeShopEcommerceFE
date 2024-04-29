import { memo, useState } from "react";
import { Select } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import VariantItemValue from "./VariantItemValue";

const VariantItem = ({ index, variantItem, cb_setProduct_variants }: any) => {
  const { values = [] } = variantItem;
  return (
    <>
      <div className="option__item">
        <div className="mb-4">
          <h4 className="form-label">Options {index + 1}</h4>
          <input
            type="text"
            placeholder="Type here"
            className="form-control"
            id="product_title"
            value={variantItem?.name}
            onChange={(e) => {
              // setName(e.target.value);
              if (cb_setProduct_variants)
                cb_setProduct_variants(variantItem?.id, "name", e.target.value);
            }}
          />
        </div>
        {values.map((vv: any, ind: number) => {
          return (
            <VariantItemValue
              key={ind}
              ind={ind}
              name={variantItem?.name}
              value={vv}
              cb_onChange={(ind: any, value: any) => {
                const __values = [...values];
                __values[ind] = value;
                if (cb_setProduct_variants)
                  cb_setProduct_variants(variantItem?.id, "values", __values);
              }}
            />
          );
        })}
      </div>
      <div className="dashed__f14130 mb12px"></div>
    </>
  );
};
export default memo(VariantItem);
