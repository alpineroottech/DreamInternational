import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NiceSelect from "../Header/NiceSelect";
import { useCollection } from "../../public-cms/hooks";

function Booking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: "",
        adventureType: "",
        duration: "",
        category: ""
    });

    // Pull real destinations and categories from CMS so the dropdowns stay
    // in sync with what's actually in the database.
    const cmsDestinations = useCollection("/public/destinations");
    const cmsCategories = useCollection("/public/categories");

    const destinationOptions = cmsDestinations && cmsDestinations.length
        ? cmsDestinations.map((d) => ({ value: d.slug, label: d.name }))
        : [
            { value: "pokhara", label: "Pokhara" },
            { value: "kathmandu", label: "Kathmandu" },
            { value: "chitwan", label: "Chitwan" },
        ];

    const adventureOptions = [
        { value: "trekking", label: "Trekking" },
        { value: "cultural", label: "Cultural Tour" },
        { value: "adventure", label: "Adventure" },
        { value: "jungle-safari", label: "Jungle Safari" },
    ];

    const durationOptions = [
        { value: "1-3", label: "1–3 Days" },
        { value: "4-7", label: "4–7 Days" },
        { value: "8-14", label: "8–14 Days" },
        { value: "15+", label: "15+ Days" },
    ];

    const categoryOptions = cmsCategories && cmsCategories.length
        ? cmsCategories.map((c) => ({ value: c.slug, label: c.name }))
        : [
            { value: "trekking", label: "Trekking" },
            { value: "cultural-tours", label: "Cultural Tours" },
            { value: "adventure", label: "Adventure" },
        ];

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Build query string from whatever the user filled in and navigate to
        // the Tours listing page, which will read and apply these filters.
        const params = new URLSearchParams();
        if (formData.destination) params.set("destination", formData.destination);
        if (formData.adventureType) params.set("type", formData.adventureType);
        if (formData.duration) params.set("duration", formData.duration);
        if (formData.category) params.set("category", formData.category);
        navigate(`/tour?${params.toString()}`);
    };

    return (
        <div className="booking-sec">
            <div className="container">
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="input-wrap">
                        <div className="row align-items-center justify-content-between">
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-route" />
                                </div>
                                <div className="search-input">
                                    <label>Destination</label>
                                    <NiceSelect
                                        options={destinationOptions}
                                        defaultValue="Select Destination"
                                        onChange={(value) => handleChange("destination", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-regular fa-person-hiking" />
                                </div>
                                <div className="search-input">
                                    <label>Type</label>
                                    <NiceSelect
                                        options={adventureOptions}
                                        defaultValue="Adventure"
                                        onChange={(value) => handleChange("adventureType", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-clock" />
                                </div>
                                <div className="search-input">
                                    <label>Duration</label>
                                    <NiceSelect
                                        options={durationOptions}
                                        defaultValue="Duration"
                                        onChange={(value) => handleChange("duration", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-auto">
                                <div className="icon">
                                    <i className="fa-light fa-map-location-dot" />
                                </div>
                                <div className="search-input">
                                    <label>Tour Category</label>
                                    <NiceSelect
                                        options={categoryOptions}
                                        defaultValue="Select Category"
                                        onChange={(value) => handleChange("category", value)}
                                    />
                                </div>
                            </div>
                            <div className="form-btn col-md-12 col-lg-auto">
                                <button className="th-btn" type="submit">
                                    <img src="/assets/img/icon/search.svg" alt="" />
                                    Search
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
