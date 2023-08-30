import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TopHeader() {
  const navigate = useNavigate();

  return (
    <div className="Announcement ">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex align-items-center display-none">
            <p
              onClick={() => {
                navigate("/");
              }}
            >
              HOME
            </p>
            <p onClick={() => {}}> 0943 090 090 </p>
          </div>
          <div className=" col-12 col-lg-6 justify-content-center justify-content-lg-end d-flex align-items-center">
            <Link to="">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link to="">
              <i className="fab fa-linkedin-in"></i>
            </Link>
            <Link to="">
              <i className="fab fa-youtube"></i>
            </Link>
            <Link to="">
              <i className="fab fa-pinterest-p"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
