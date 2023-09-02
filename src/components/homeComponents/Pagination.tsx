import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pagination = (props: any) => {
  const navigate = useNavigate();

  const [iterator, setiterator] = useState<any>([]);
  const [total, settotal] = useState<any>(1);
  const [page, setpage] = useState<any>(1);
  const [keyword, setkeyword] = useState<any>("");
  const [brand, setbrand] = useState<any>("");

  useEffect(() => {
    //@ts-ignore
    setiterator([...Array(props?.total).keys()]);
    settotal(props?.total ?? 1);
    setpage(props?.page ?? 1);
    setkeyword(props?.keyword ?? "");
    setbrand(props?.brand ?? "");
  }, [props]);

  return total > 1 ? (
    <nav>
      <ul className="pagination justify-content-center">
        {iterator.map((x: any) => (
          <li
            className={`page-item ${x + 1 === page ? "active" : ""}`}
            key={x + 1}
          >
            <div
              onClick={() => {
                navigate(`/?page=${x + 1}&&search=${keyword}&&brand=${brand}`);
              }}
              className="page-link"
            >
              {x + 1}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  ) : (
    <></>
  );
};

export default Pagination;
