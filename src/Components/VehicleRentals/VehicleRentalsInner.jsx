import React, { useMemo, useState } from 'react';
import { useCollection, resolveCmsList } from '../../public-cms/hooks';
import VehicleRentalCard from './VehicleRentalCard';
import RentalInquiryWidget from './RentalInquiryWidget';

const TYPE_FILTERS = [
    { value: '', label: 'All Vehicles' },
    { value: 'car', label: 'Cars' },
    { value: 'jeep', label: 'Jeeps / SUVs' },
    { value: 'van', label: 'Vans & Minibuses' },
    { value: 'bus', label: 'Buses & Coaches' },
    { value: 'driver-only', label: 'Hire a Driver' },
];

function VehicleRentalsInner() {
    const [typeFilter, setTypeFilter] = useState('');
    const cms = useCollection('/public/vehicle-rentals');
    const { loading, items: rentals } = resolveCmsList(cms, []);

    const filtered = useMemo(
        () => (typeFilter ? rentals.filter((r) => r.vehicleType === typeFilter) : rentals),
        [rentals, typeFilter]
    );

    return (
        <section className="space">
            <div className="container">
                <div className="di-vehicle-filters mb-4 d-flex flex-wrap gap-2 justify-content-center">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            type="button"
                            className={`th-btn style4 di-vehicle-filter-btn${typeFilter === f.value ? ' active' : ''}`}
                            onClick={() => setTypeFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-center text-muted mb-0">Loading vehicles…</p>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="mb-0">No vehicles match this filter yet — check back soon or contact us for availability.</p>
                    </div>
                ) : (
                    <div className="row gy-24 gx-24">
                        {filtered.map((rental) => (
                            <div key={rental.id || rental.slug} className="col-md-6 col-lg-4">
                                <VehicleRentalCard rental={rental} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-5 pt-4">
                    <RentalInquiryWidget />
                </div>
            </div>
        </section>
    );
}

export default VehicleRentalsInner;
