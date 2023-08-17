import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  useCheckAddressMutation,
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

  const [checkAddress, { isLoading: LoadingcheckAddress }] =
    useCheckAddressMutation();

  const onCheckAddress = async () => {
    const res = await checkAddress({});
    //@ts-ignore
    const data = res?.data;
    if (data) {

      setStreet(data?.street);
      setCity(data?.city);
      setPostalCode(data?.postalCode);
      setCountry(data?.country);
      // if (data?.error) navigate("/shipping");
    } else {
    }
  };

  useEffect(() => {
    onCheckAddress();
  }, []);

  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const onCreateAddress = async (values: any) => {
    const res = await createAddress(values);
    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
      navigate("/payment");
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
    <>
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
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
    </>
  );
};

export default ShippingScreen;
