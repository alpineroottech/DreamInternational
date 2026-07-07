import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NiceSelect from "../Header/NiceSelect";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";

const ANY = { value: "", label: "Any / All" };

function Booking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: "",
        category: "",
        duration: "",
    });

    const cmsCategories = useCollection("/public/categories");

    const catResolved = resolveCmsList(cmsCategories, []);

    const destinationOptions = [
        ANY,
        { value: "everest", label: "Everest Region" },
        { value: "annapurna", label: "Annapurna" },
        { value: "pokhara", label: "Pokhara" },
        { value: "kathmandu", label: "Kathmandu Valley" },
        { value: "chitwan", label: "Chitwan" },
        { value: "lumbini", label: "Lumbini" },
    ];

    const categoryOptions = [
        ANY,
        ...(catResolved.loading
            ? []
            : cmsCategories && cmsCategories.length
                ? cmsCategories.map((c) => ({ value: c.slug, label: c.name }))
                : [
                    { value: "trekking", label: "Trekking" },
                    { value: "cultural-tours", label: "Cultural Tours" },
                    { value: "adventure", label: "Adventure" },
                ]),
    ];

    const durationOptions = [
        ANY,
        { value: "1-3", label: "1–3 days" },
        { value: "4-7", label: "4–7 days" },
        { value: "8-14", label: "8–14 days" },
        { value: "15+", label: "15+ days" },
    ];

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (formData.destination) params.set("destination", formData.destination);
        if (formData.category) params.set("category", formData.category);
        if (formData.duration) params.set("duration", formData.duration);
        const qs = params.toString();
        navigate(qs ? `/tour?${qs}` : "/tour");
    };

    return (
        <div className="booking-sec">
            <div className="container">
                <p className="booking-sec__lead text-center mb-3">
                    Find a Nepal experience by <strong>region</strong>, <strong>experience type</strong>, and <strong>trip length</strong>.
                </p>
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="input-wrap">
                        <div className="row align-items-center justify-content-between g-3">
                            <div className="form-group col-md-6 col-lg">
                                <div className="icon">
                                    <i className="fa-light fa-map-location-dot" />
                                </div>
                                <div className="search-input">
                                    <label>Where to go?</label>
                                    <NiceSelect
                                        options={destinationOptions}
                                        placeholder="Any region"
                                        onChange={(value) => handleChange("destination", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg">
                                <div className="icon">
                                    <i className="fa-regular fa-person-hiking" />
                                </div>
                                <div className="search-input">
                                    <label>Experience</label>
                                    <NiceSelect
                                        options={categoryOptions}
                                        placeholder="Any experience"
                                        onChange={(value) => handleChange("category", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg">
                                <div className="icon">
                                    <i className="fa-light fa-clock" />
                                </div>
                                <div className="search-input">
                                    <label>Trip length</label>
                                    <NiceSelect
                                        options={durationOptions}
                                        placeholder="Any duration"
                                        onChange={(value) => handleChange("duration", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-btn col-md-12 col-lg-auto">
                                <button className="th-btn" type="submit">
                                    <img src="/assets/img/icon/search.svg" alt="" />
                                    Find tours
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Booking;
