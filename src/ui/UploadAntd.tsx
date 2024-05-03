import React, { memo } from "react";
import { Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useUploadImgMutation } from "../store/components/products/productsApi";
import { FOLDER_PRODUCS_STORAGE } from "../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../store/components/customDialog/toastSlice";

const SIZE = 5;
const sizeMax = SIZE * 1000 * 1000;
const UploadAntd = ({
  fileList,
  cb_setFileList,
  cb_handleImageAttribute,
}: any) => {
  const dispatch = useDispatch();

  const [uploadImg, { isLoading: isLoadingUpload }] = useUploadImgMutation();

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const sizeImg = file ? +file?.size : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);

      await uploadImg({
        formData,
        folder: FOLDER_PRODUCS_STORAGE,
      })
        .then((res: any) => {
          const data = res?.data?.metadata;
          if (data) cb_handleImageAttribute(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      cb_setFileList([]);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: `File is so Big, must less than ${SIZE}MB`,
          step: 2,
        })
      );
    }
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    cb_setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Upload
      fileList={fileList}
      listType="picture-card"
      accept=".png,.jpeg,.gif,.jpg"
      onChange={onChange}
      onPreview={onPreview}
      customRequest={uploadImage}
    >
      {fileList.length < 1 && "Choose file"}
    </Upload>
  );
};
export default memo(UploadAntd);
