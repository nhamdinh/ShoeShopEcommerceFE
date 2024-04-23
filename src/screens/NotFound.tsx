import { Link, useNavigate } from "react-router-dom";
import mainLogo2 from "./../images/not-found.png";
import DocumentTitle from "../components/DocumentTitle";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <DocumentTitle title={"NotFound"}></DocumentTitle>

      <div className="container my-5">
        <div className="row justify-content-center align-items-center">
          <h4 className="text-center mb-2 mb-sm-5">Page Not Found</h4>
          <img
            style={{ width: "100%", height: "300px", objectFit: "contain" }}
            src={mainLogo2}
            alt="Not-found"
          />
          <button
            onClick={() => {
              navigate("/");
            }}
            className="col-md-3 col-sm-6 col-12 btn btn-success mt-5"
          >
            <div className="text-white text-decoration-none">Home page</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
