import React from 'react';
import TourguideCard from './TourguideCard';
import { useCollection } from '../../public-cms/hooks';

function TourGuideInner() {
    const currentPage = 1;
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

    const posts = Array.isArray(cms)
        ? cms.map((m) => ({ id: m.slug, thumb: m.photoUrl, image: m.photoUrl, title: m.name, role: m.role, socials: m.socials }))
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <section className="space" id="team-sec">
            <div className="container">
                <div className="row gy-4 gx-30">
                    {posts.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <p className="mb-0">No team members published yet. Please check back soon.</p>
                        </div>
                    ) : currentPosts.map((data, index) => (
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
