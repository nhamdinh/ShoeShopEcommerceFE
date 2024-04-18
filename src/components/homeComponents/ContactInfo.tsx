import React from "react";

const ContactInfo = () => {
  return (
    <div className="contactInfo container">
      <div className="row">
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-phone-alt"></i>
            </div>
            <h5>Call Us 24x7</h5>
            <p>0943 090 090</p>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h5>Nham.nguyen</h5>
            <p>01 Duy Tan - Cau Giay</p>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-fax"></i>
            </div>
            <h5>Fax</h5>
            <p>0943 090 090</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;


// import React, { useEffect, useRef, useState } from "react";
// const SLIDE_5000 = 5000;
// const ContactInfo = () => {
//   const dataBanner = [
//     "https://baoviet-online.vn/wp-content/uploads/2017/02/anh-thuong-hieu-so-1.png",
//     "https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:08:48_day-be-viet-so-2.jpg",
//     "https://vansu.net/sites/default/files/schritt_3.jpg",
//     "https://monkeymedia.vcdn.com.vn/upload/web/storage_web/29-07-2022_17:20:02_day-viet-so-4.jpg",
//     "https://monkeymedia.vcdn.com.vn/upload/web/storage_web/28-07-2022_16:27:22_cach-viet-chu-so-5.jpg",
//   ];
//   const lastInd = dataBanner.length - 1;

//   const [indexSlide, setIndexSlide] = useState<number>(1);

//   let slider: any = null;

//   useEffect(() => {
//     slider = setInterval(() => {
//       setIndexSlide((prev) => prev + 1);
//     }, SLIDE_5000);
//     return () => clearInterval(slider);
//   });

//   useEffect(() => {
//     if (indexSlide < 0) {
//       setIndexSlide(lastInd);
//     }
//     if (indexSlide > lastInd) {
//       setIndexSlide(0);
//     }
//   }, [indexSlide]);

//   const dragItemParent = useRef<any>(null);
//   const dragOverItemParent = useRef<any>(null);

//   const handleDragEnd = () => {
//     if (dragItemParent.current !== dragOverItemParent.current) {
//       if (dragItemParent.current < dragOverItemParent.current) {
//         setIndexSlide((prev) => prev - 1);
//       } else {
//         setIndexSlide((prev) => prev + 1);
//       }
//     }
//     dragItemParent.current = null;
//     dragOverItemParent.current = null;
//   };

//   return (
//     <div className="contactInfo container">
//       <div className="row">
//         <div className="home__slide">
//           {dataBanner.map((item, personIndex) => {
//             return (
//               <div key={personIndex}>
//                 <article
//                   className={
//                     indexSlide === personIndex
//                       ? "activeSlide"
//                       : personIndex === indexSlide - 1 ||
//                         (indexSlide === 0 &&
//                           personIndex === dataBanner?.length - 1)
//                       ? "nextSlide"
//                       : "lastSlide"
//                   }
//                 >
//                   <img
//                     className="img__product"
//                     src={item}
//                     alt="product"
//                     draggable
//                     onDragStart={(e) => {
//                       console.log(e.clientX);
//                       dragItemParent.current = e.clientX;
//                     }}
//                     onDragEnter={(e) => {
//                       // console.log(e.clientY )
//                       dragOverItemParent.current = e.clientX;
//                     }}
//                     onDragEnd={handleDragEnd}
//                     onDragOver={(e) => e.preventDefault()}
//                   />
//                 </article>
//                 <div
//                   className="move to__left"
//                   onClick={() => {
//                     setIndexSlide((prev) => prev - 1);
//                   }}
//                 >
//                   {"<<"}
//                 </div>
//                 <div
//                   className="move to__right"
//                   onClick={() => {
//                     setIndexSlide((prev) => prev + 1);
//                   }}
//                 >
//                   {">>"}
//                 </div>

//                 {/* <div className="num__back"></div> */}
//                 <div className="move num">
//                   {indexSlide + 1} / {dataBanner.length}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactInfo;
