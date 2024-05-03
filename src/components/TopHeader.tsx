import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANG_STORAGE, LOCALES } from "../utils/constants";
import i18n1 from "./../locales/config";

export default function TopHeader() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<any>('en');
  const activeLocale = LOCALES.find((ll : any) => ll.value === locale);

  useEffect(() => {
    const lang = localStorage.getItem(LANG_STORAGE);
    if (lang) {
      i18n.changeLanguage(lang);
      setLocale(lang);
    } else {
      i18n.changeLanguage("en");
      setLocale("en");
    }
  }, []);


  return (
    <div className="Announcement ">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex align-items-center display-none">
            <p
            className="cursor__pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              HOME &emsp; 0943 090 090
            </p>
            <p onClick={() => {}}>{` admin@example.com | 123456`}</p>

          </div>
          <div className=" col-12 col-lg-6 justify-content-center justify-content-lg-end d-flex align-items-center">
                          <button className="w36px h36px ppp"
                                    aria-label="Change language"
                                    onClick={()=>{
                                        if (i18n1?.language === "vi") {
                                            i18n.changeLanguage("en");
                                            setLocale("en")
                                            localStorage.setItem(LANG_STORAGE, "en");
                                          } else {
                                            i18n.changeLanguage("vi");
                                            setLocale("vi")
                                            localStorage.setItem(LANG_STORAGE, "vi");
                                          }
                                    }}>
                              <img src={activeLocale?.icon} alt={activeLocale?.label}/>
                            </button>



{/*             <Link to="">
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
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
