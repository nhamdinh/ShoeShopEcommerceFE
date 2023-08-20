import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { useGetOrderUserQuery } from "../../store/components/orders/ordersApi";
const Orders = () => {
  const navigate = useNavigate();

  const [orders, setorders] = useState<any>([]);

  const {
    data: dataFetch,
    error,
    isSuccess,
    isLoading,
  } = useGetOrderUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setorders(dataFetch);
    }
  }, [dataFetch]);

  return (
    <div className=" d-flex justify-content-center align-items-center flex-column">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger" mess={JSON.stringify(error)}></Message>
      ) : (
        <>
          {orders?.length === 0 ? (
            <div className="col-12 alert alert-info text-center mt-3">
              No Orders
              <Link
                className="btn btn-success mx-2 px-3 py-2"
                to="/"
                style={{
                  fontSize: "12px",
                }}
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order: any) => (
                    <tr
                      className={`${
                        order?.isPaid ? "alert-success" : "alert-danger"
                      }`}
                      key={order?._id}
                    >
                      <td>
                        <span
                          className="link"
                          onClick={() => {
                            navigate(`/order/${order?._id}`);
                          }}
                        >
                          {order?._id}
                        </span>
                      </td>
                      <td>{order?.isPaid ? <>Paid</> : <>Not Paid</>}</td>
                      <td>
                        {order?.isPaid
                          ? moment(order?.paidAt).calendar()
                          : moment(order?.createdAt).calendar()}
                      </td>
                      <td>${order?.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
