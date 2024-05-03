import { memo, useEffect, useMemo, useState } from "react";
import {
  UpOutlined,
  DownOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import VariantItemValue from "./VariantItemValue";

import type { ColumnsType } from "antd/es/table";
import { Button, Input, Radio, Select } from "antd";
import { Table, Checkbox } from "antd";
import { addZero, equal } from "../../../utils/commonFunction";
import { RE_ONLY_NUMBER } from "../../../utils/constants";

interface DataType {
  id?: string;
}

const TableCreateSku = ({
  skuProduct = [],
  productVariants = [],
  dataTableDisplay = [],
  cb_setDataTableDisplay,
  cb_setPrice,
  cb_setPriceMax,
  cb_setCountInStock,
}: any) => {
  function generateCombinations(dataArr: any) {
    if (!dataArr.length) return [];
    const result = [];
    const indices = new Array(dataArr.length).fill(0);
    const maxIndices = dataArr.map(({ values }: any) => values.length);

    while (true) {
      const entry: any = {};
      indices.forEach(
        (idx, i) => (entry[dataArr[i].name] = dataArr[i].values[idx])
      );
      entry.sku_tier_index = [...indices];

      result.push(entry);

      let inc = dataArr.length - 1;
      while (inc >= 0) {
        indices[inc]++;
        if (indices[inc] >= maxIndices[inc]) {
          indices[inc] = 0;
          inc--;
        } else {
          break;
        }
      }
      if (inc < 0) break;
    }

    return result;
  }

  useEffect(() => {
    const __productVariants = productVariants
      .filter((pp: any) => pp.name && pp.values.length > 1)
      .map((kk: any) => {
        const final: any = { ...kk };
        final.values = kk.values.filter((vv: any) => vv !== "");
        return final;
      });
    // console.log(__productVariants);
    const __generateCombinations = generateCombinations(__productVariants);
    // console.log(__generateCombinations);
    if (cb_setDataTableDisplay)
      cb_setDataTableDisplay(
        __generateCombinations.map((vv: any, index: number) => {
          return {
            ...vv,
            id: index,
            sku_stock: 0,
            sku_price: 0,
          };
        })
      );
  }, [productVariants]);

  const onChangeData = (field: any, record: any, value: any) => {
    const _tableVariant: any = dataTableDisplay.map((item: any) => {
      const final = { ...item };
      if (final?.id === record?.id) {
        final[field] = value;
      }
      return final;
    });
    if (cb_setDataTableDisplay) cb_setDataTableDisplay(_tableVariant);

    setPrice(_tableVariant);

    const totalQuantity = _tableVariant.reduce(
      (accumulator: any, item: any) => +accumulator + +item?.sku_stock,
      [0]
    );
    if (cb_setCountInStock) cb_setCountInStock(totalQuantity);
  };

  const addCol = useMemo(() => {
    const columns: ColumnsType<DataType> = [
      {
        title: "No.",
        dataIndex: "id",
        ellipsis: true,
        align: "center",

        render: (_, __, index: any) => <>{addZero(index + 1)}</>,
      },
      {
        title: "Price",
        dataIndex: "sku_price",
        // sorter: true,
        // showSorterTooltip: false,
        // width: "140px",

        ellipsis: true,
        align: "center",
        //   width: "10%",
        render: (sku_price: any, record: any) => {
          return (
            <Input
              type="number"
              value={sku_price}
              onChange={(e) => {
                const numInput = e.target.value;
                if (numInput.length < 7)
                  if (!numInput || numInput.match(RE_ONLY_NUMBER)) {
                    onChangeData("sku_price", record, +numInput);
                  }
              }}
            />
          );
        },
      },
      {
        title: "Quantity",
        dataIndex: "sku_stock",
        ellipsis: true,
        // sorter: true,
        // showSorterTooltip: false,
        // width: "140px",

        align: "center",
        //   width: "10%",
        render: (sku_stock: any, record: any) => (
          <Input
            type="number"
            value={sku_stock}
            onChange={(e) => {
              const numInput = e.target.value;
              if (numInput.length < 7)
                if (!numInput || numInput.match(RE_ONLY_NUMBER)) {
                  onChangeData("sku_stock", record, +numInput);
                }
            }}
          />
        ),
      },
    ];
    const colKeys: any = productVariants
      .filter((pp: any) => pp.name && pp.values.length > 1)
      .map((ppp: any) => ppp.name);
    colKeys.reverse();
    if (colKeys.length > 0) {
      colKeys.map((item: any) => {
        columns.splice(1, 0, {
          // width: "140px",
          title: item,
          dataIndex: item,
          ellipsis: true,
          // sorter: true,
          // showSorterTooltip: false,
          align: "center",
          // width: "140px",

          //   render: (index: any) => <>{addZero(index + 1)}</>,
        });
      });
    }

    return columns;
  }, [productVariants, dataTableDisplay]);

  useEffect(() => {
    if (skuProduct.length && productVariants.length) {
      const __productVariants = productVariants
        .filter((pp: any) => pp.name && pp.values.length > 1)
        .map((kk: any) => {
          const final: any = { ...kk };
          final.values = kk.values.filter((vv: any) => vv !== "");
          return final;
        });
      // console.log(__productVariants);
      const __generateCombinations = generateCombinations(__productVariants);

      const addStock = __generateCombinations.map((vv: any, index: number) => {
        return {
          ...vv,
          id: index,
          sku_stock: 0,
          sku_price: 0,
        };
      });

      const changeStock: any = addStock.map((vv: any, index: number) => {
        const final: any = {};
        for (let oo in skuProduct) {
          const {
            sku_tier_index = [],
            _id,
            sku_stock,
            sku_price,
          } = skuProduct[oo];
          if (equal(sku_tier_index, vv.sku_tier_index)) {
            final._id = _id;
            final.sku_stock = sku_stock;
            final.sku_price = sku_price;
          }
        }

        return { ...vv, ...final };
      });

      setPrice(changeStock);

      if (cb_setDataTableDisplay) cb_setDataTableDisplay(changeStock);
    }
  }, [skuProduct]);

  const setPrice = (_tableVariant = []) => {
    /*  */
    const priceArr: any = _tableVariant.filter(
      ({ sku_price }: any) => sku_price > 0
    );
    priceArr.sort((aa: any, bb: any) => aa.sku_price - bb.sku_price);
    if (priceArr.length) {
      if (cb_setPrice) cb_setPrice(priceArr[0]?.sku_price);
      if (cb_setPriceMax)
        cb_setPriceMax(priceArr[priceArr.length - 1]?.sku_price);
    } else {
      if (cb_setPrice) cb_setPrice(0);
      if (cb_setPriceMax) cb_setPriceMax(0);
    }
    /*  */
  };

  return (
    <Table
      dataSource={dataTableDisplay}
      columns={addCol}
      pagination={false}
      // scroll={{ x: 1000, y: 700 }}
      rowKey={(record) => `${record?.id}`}
      // rowSelection={{
      //   type: "checkbox",
      //   selectedRowKeys: selectedRows.map((item) => `${item.id}`),
      //   onChange: (_, selectedRows) => {
      //     setSelectedRows(selectedRows);
      //   },
      //   getCheckboxProps: (record) => ({
      //     name: record?.id,
      //     value: `${record?.id}`,
      //   }),
      // }}
      onChange={(_, __, sorter: any) => {
        // const sortVal1 = sortVal === "asc" ? 1 : -1;
        // const tableVariant_temp = [...tableVariant];
        // tableVariant_temp.sort((a, b) =>
        //   a[sorter.field] > b[sorter.field]
        //     ? sortVal1
        //     : a[sorter.field] < b[sorter.field]
        //     ? sortVal1 * -1
        //     : 0
        // );
        // setSortVal((prev: any) => (prev === "desc" ? "asc" : "desc"));
        // setTableVariant(tableVariant_temp);
      }}
    />
  );
};
export default memo(TableCreateSku);
