import React from "react";
import { Link } from "react-router-dom";
import FaqInner from "./FaqInner";

/** Homepage FAQ accordion — reuses the full FAQ page's component and CMS data, plus a link to the full FAQ page. */
function HomeFaq() {
    return (
        <section className="di-home-faq bg-smoke">
            <FaqInner />
            <div className="container text-center pb-4">
                <Link to="/faq" className="th-btn style3">View All FAQs</Link>
            </div>
        </section>
    );
}

export default HomeFaq;
