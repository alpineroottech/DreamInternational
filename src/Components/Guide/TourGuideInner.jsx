import React, { useState } from 'react';
import TourguideCard from './TourguideCard';
import jsonPosts from '../data/data-guide.json';
import { useCollection } from '../../public-cms/hooks';

function TourGuideInner() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const cms = useCollection('/public/team');

    if (cms === undefined) {
        return (
            <section className="space" id="team-sec">
                <div className="container text-center py-5">
                    <p className="mb-0">Loading team…</p>
                </div>
            </section>
        );
    }

    const posts = cms && cms.length
        ? cms.map((m) => ({ id: m.slug, thumb: m.photoUrl, image: m.photoUrl, title: m.name, role: m.role, socials: m.socials }))
        : jsonPosts;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <section className="space" id="team-sec">
            <div className="container">
                <div className="row gy-4 gx-30">
                    {currentPosts.map((data, index) => (
                        <div key={data.id} className="col-xl-4 col-md-6">
                            <TourguideCard
                                guideID={data.id}
                                guideThumb={`${data.thumb}`}
                                guideImage={`${data.image}`}
                                guideTitle={data.title}
                                guideRole={data.role}
                                guideSocials={data.socials}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TourGuideInner;
