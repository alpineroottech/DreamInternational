import React from "react";
import { Link } from "react-router-dom";

function DestinationOne() {
  return (
    <div className="position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Featured Destination</span>
          <h2 className="sec-title">Pokhara City, Nepal</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="destination-box">
              <div className="destination-img">
                <img src="/assets/img/hero/R.jpg" alt="Pokhara City and Phewa Lake" />
              </div>
              <div className="destination-content p-4 p-md-5">
                <div className="media-left">
                  <h4 className="box-title mb-2">
                    <Link to="/destination/1">Pokhara City</Link>
                  </h4>
                  <span className="destination-subtitle d-block mb-3">
                    3–5 Days | Lakeside Stay | Best Season: Mar–May, Sep–Nov
                  </span>
                  <p className="mb-4">
                    Nepal&apos;s lakeside city with Phewa Lake, mountain views, paragliding, and easy access to Annapurna treks.
                  </p>
                </div>
                <div>
                  <Link to="/destination/1" className="th-btn style2 th-icon">
                    View Destination Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationOne;
