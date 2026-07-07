import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NiceSelect from "../Header/NiceSelect";
import { useCollection, resolveCmsList } from "../../public-cms/hooks";

const ANY = { value: "", label: "Any / All" };

function Booking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: "",
        type: "",
        duration: "",
        category: "",
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

    const typeOptions = [
        ANY,
        { value: "adventure", label: "Adventure" },
        { value: "trekking", label: "Trekking" },
        { value: "cultural-tours", label: "Cultural" },
        { value: "jungle-safari", label: "Jungle Safari" },
        { value: "pilgrimage", label: "Pilgrimage" },
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
        if (formData.type) params.set("type", formData.type);
        if (formData.category) params.set("category", formData.category);
        if (formData.duration) params.set("duration", formData.duration);
        const qs = params.toString();
        navigate(qs ? `/tour?${qs}` : "/tour");
    };

    return (
        <div className="booking-sec di-booking-bar">
            <div className="container">
                <form onSubmit={handleSubmit} className="booking-form di-booking-form">
                    <div className="di-booking-form__inner">
                        <div className="di-booking-field">
                            <div className="di-booking-field__icon" aria-hidden="true">
                                <i className="fa-light fa-map-location-dot" />
                            </div>
                            <div className="di-booking-field__body">
                                <span className="di-booking-field__label">Destination</span>
                                <NiceSelect
                                    options={destinationOptions}
                                    placeholder="Select destination"
                                    onChange={(value) => handleChange("destination", value)}
                                />
                            </div>
                        </div>

                        <div className="di-booking-field">
                            <div className="di-booking-field__icon" aria-hidden="true">
                                <i className="fa-regular fa-compass" />
                            </div>
                            <div className="di-booking-field__body">
                                <span className="di-booking-field__label">Type</span>
                                <NiceSelect
                                    options={typeOptions}
                                    placeholder="Adventure"
                                    onChange={(value) => handleChange("type", value)}
                                />
                            </div>
                        </div>

                        <div className="di-booking-field">
                            <div className="di-booking-field__icon" aria-hidden="true">
                                <i className="fa-light fa-clock" />
                            </div>
                            <div className="di-booking-field__body">
                                <span className="di-booking-field__label">Duration</span>
                                <NiceSelect
                                    options={durationOptions}
                                    placeholder="Duration"
                                    onChange={(value) => handleChange("duration", value)}
                                />
                            </div>
                        </div>

                        <div className="di-booking-field">
                            <div className="di-booking-field__icon" aria-hidden="true">
                                <i className="fa-light fa-grid-2" />
                            </div>
                            <div className="di-booking-field__body">
                                <span className="di-booking-field__label">Tour category</span>
                                <NiceSelect
                                    options={categoryOptions}
                                    placeholder="Select category"
                                    onChange={(value) => handleChange("category", value)}
                                />
                            </div>
                        </div>

                        <button className="th-btn di-booking-submit" type="submit">
                            Search
                            <i className="fa-light fa-magnifying-glass" aria-hidden="true" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Booking;
