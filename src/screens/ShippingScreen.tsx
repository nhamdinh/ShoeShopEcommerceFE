import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  useCheckAddressQuery,
  // useCheckAddressMutation,
  useCreateAddressMutation,
} from "../store/components/orders/ordersApi";

const ShippingScreen = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [street, setStreet] = useState<any>("");
  const [city, setCity] = useState<any>("");
  const [postalCode, setPostalCode] = useState<any>("");
  const [country, setCountry] = useState<any>("");

  const {
    data: dataCheckAddress,
    error: errorCheckAddress,
    isSuccess: isSuccessCheckAddress,
    isLoading: isLoadingCheckAddress,
  } = useCheckAddressQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccessCheckAddress) {
      setStreet(dataCheckAddress?.street);
      setCity(dataCheckAddress?.city);
      setPostalCode(dataCheckAddress?.postalCode);
      setCountry(dataCheckAddress?.country);
    }
  }, [dataCheckAddress]);

  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const onCreateAddress = async (values: any) => {
    const res = await createAddress(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
      navigate("/profile");
    } else {
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onCreateAddress({
      street: street,
      city: city,
      postalCode: postalCode,
      country: country,
    });

    // dispatch(saveShippingAddress({ street, city, postalCode, country }));
  };
  return (
    <div className="container d-flex justify-content-center align-items-center login-center">
      <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
        <h6>DELIVERY ADDRESS</h6>
        <input
          type="text"
          placeholder="Enter street"
          value={street}
          // required
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          // required
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter postal code"
          value={postalCode}
          // required
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter country"
          value={country}
          // required
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default ShippingScreen;
