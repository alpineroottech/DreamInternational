import React from 'react';
import ServiceCard from './ServiceCard';
import { useCollection } from '../../public-cms/hooks';

function ServiceInner() {
    const cms = useCollection('/public/services');

    if (cms === undefined) {
        return (
            <section className="position-relative overflow-hidden space" id="destination-sec">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading services…</p>
                </div>
            </section>
        );
    }

    const posts = Array.isArray(cms)
        ? cms.map((s) => ({ id: s.slug, title: s.title, item: s.shortDescription || '' }))
        : [];

    if (posts.length === 0) {
        return (
            <section className="position-relative overflow-hidden space" id="destination-sec">
                <div className="container text-center py-5">
                    <p className="mb-0">No services published yet. Please check back soon.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="position-relative overflow-hidden space" id="destination-sec">
            <div className="container">
                <div className="row gy-4">
                    {posts.map((data) => (
                        <div key={data.id} className="col-lg-4 col-md-6 d-flex">
                            <ServiceCard
                                serviceID={data.id}
                                serviceTitle={data.title}
                                serviceItem={data.item}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServiceInner;
