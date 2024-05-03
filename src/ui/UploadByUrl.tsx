import { memo, useState } from "react";
import { useUploadImgUrlMutation } from "../store/components/products/productsApi";
import LoadingButton from "../components/LoadingError/LoadingButton";

const UploadByUrl = ({ cb_handleImageAttribute }: any) => {
  const [urlImage, setUrlImage] = useState<any>("");

  const [uploadImgUrl, { isLoading: isLoadingUploadUrl }] =
    useUploadImgUrlMutation();
  const onUploadImgUrl = async () => {
    await uploadImgUrl({
      urlImage,
    })
      .then((res: any) => {
        const data = res?.data?.metadata;
        if (data) cb_handleImageAttribute(data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  return (
    <>
      <input
        type="text"
        placeholder="Type here"
        className="form-control"
        id="urlImage"
        value={urlImage}
        onChange={(e) => setUrlImage(e.target.value)}
      />
      {isLoadingUploadUrl ? (
        <LoadingButton />
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUploadImgUrl();
          }}
          disabled={!urlImage}
          type="submit"
          className="btn btn-primary mt8px"
        >
          Upload Url Image
        </button>
      )}
    </>
  );
};
export default memo(UploadByUrl);
