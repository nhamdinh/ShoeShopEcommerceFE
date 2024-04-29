import { memo } from "react";

const VariantItemValue = ({ ind, name, value, cb_onChange }: any) => {
  return (
    <div className="mb-4">
      <h5 className="form-label">
        {name && "[" + name + "]"} Value {ind + 1}
      </h5>
      <input
        type="text"
        placeholder="Type here"
        className="form-control"
        id="product_title"
        value={value}
        onChange={(e) => {
          // setName(e.target.value);
          if (cb_onChange) cb_onChange(ind, e.target.value);
        }}
      />
    </div>
  );
};
export default memo(VariantItemValue);
