import { memo, useState } from "react";
import { Select } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const SelectApp = ({
  options,
  value,
  cb_setValue,
  width,
  placeholder,
}: any) => {

  const { t } = useTranslation();
  const [isShowDropDown, setShowDropdownFilter] = useState<any>(false);

  return (
    <Select
      style={{
        width: width ?? "320px",
      }}
      placeholder={placeholder ?? "Please select"}
      suffixIcon={isShowDropDown ? <UpOutlined /> : <DownOutlined />}
      onChange={(value, opt) => {
        cb_setValue(value, opt);
      }}
      // value={productOption?.title}
      value={value}
      dropdownStyle={{
        color: "red",
      }}
      popupClassName="POPUP__filter"
      onDropdownVisibleChange={(value) => {
        setShowDropdownFilter(!isShowDropDown);
      }}
      // options={[
      //   { label: <div className="opt-lbl"><span>{('common.china_region')}</span><span>+86</span></div>, value: 86 },
      //   { label: <div className="opt-lbl"><span>{('common.korea_region')}</span><span>+82</span></div>, value: 82 },
      //   { label: <div className="opt-lbl"><span>VN</span><span>+84</span></div>, value: 84 },
      // ]}
    >
      {options.map((item: any, index: any) => {
        return (
          <Select.Option
            key={index}
            value={item?.value}
            label={t(item?.label)}
            // disabled={!checkAllow(item.value)}
            // hidden={!allow}
          >
            <div className="opt-lbl">{t(item?.label)}</div>
            {/* 
<div
role="button"
style={{
width: "100%",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}
>
{item?.label}
</div> */}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(SelectApp);
