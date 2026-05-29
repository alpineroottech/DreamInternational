import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { publicApi, useSettings } from '../../public-cms/hooks'

function ContactOne() {
    const settings = useSettings();
    const [form, setForm] = useState({ name: '', email: '', tourType: '', message: '' });
    const [status, setStatus] = useState({ state: 'idle', msg: '' });

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setStatus({ state: 'sending', msg: '' });
        try {
            await publicApi.post('/public/inquiries', {
                name: form.name,
                email: form.email,
                message: [form.tourType ? `Tour type: ${form.tourType}` : '', form.message].filter(Boolean).join('\n'),
            });
            setStatus({ state: 'success', msg: "Thanks! We've received your message and will be in touch shortly." });
            setForm({ name: '', email: '', tourType: '', message: '' });
        } catch (err) {
            const m = err?.response?.data?.error || 'Something went wrong. Please try again.';
            setStatus({ state: 'error', msg: m });
        }
    };

    const phone = settings.contactPhone || '+977-1-0000000';

    return (
        <div
            className="contact-area3 bg-top-center  overflow-hidden"
            style={{ backgroundImage: "url(/assets/img/bg/contact_bg_1.jpg)", backgroundRepeat: "no-repeat" }}
        >
            <div className="container">
                <div className="row gy-4 justify-content-between align-items-center">
                    <div className="col-lg-5">
                        <div className="pt-80 p-lg-0">
                            <div className="title-area pe-xl-5">
                                <span className="sub-title text-white">Get in touch</span>
                                <h2 className="sec-title text-white">Say hello to us</h2>
                                <p className="contact-text text-white">
                                    We'd love to hear from you. Our friendly team is always here to chat.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="contact-form-area">
                            <form onSubmit={submit} className="contact-form2 ajax-contact">
                                <div className="row">
                                    <div className="form-group col-12">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Your Name"
                                            value={form.name}
                                            onChange={(e) => setField('name', e.target.value)}
                                            required
                                        />
                                        <img src="/assets/img/icon/user.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="Your Mail"
                                            value={form.email}
                                            onChange={(e) => setField('email', e.target.value)}
                                            required
                                        />
                                        <img src="/assets/img/icon/mail.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="tourType"
                                            placeholder="Tour type (e.g. Trekking, Cultural)"
                                            value={form.tourType}
                                            onChange={(e) => setField('tourType', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <textarea
                                            name="message"
                                            cols={30}
                                            rows={3}
                                            className="form-control"
                                            placeholder="Your Message"
                                            value={form.message}
                                            onChange={(e) => setField('message', e.target.value)}
                                        />
                                        <img src="/assets/img/icon/chat.svg" alt="" />
                                    </div>
                                </div>
                                {status.state === 'success' && <p className="form-messages mb-0 mt-3 text-white">{status.msg}</p>}
                                {status.state === 'error' && <p className="form-messages mb-0 mt-3 text-warning">{status.msg}</p>}
                                <div className="form-btn-wrapp">
                                    <div className="form-btn">
                                        <button className="th-btn white-btn" type="submit" disabled={status.state === 'sending'}>
                                            {status.state === 'sending' ? 'Sending…' : 'Send Message'} <img src="/assets/img/icon/plane3.svg" alt="" />
                                        </button>
                                    </div>
                                    <div className="contact-info">
                                        <p className="contact-info_link">
                                            <Link to={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
                                        </p>
                                        <div className="contact-info_icon">
                                            <Link to={`tel:${phone.replace(/\s/g, '')}`}>
                                                <img src="/assets/img/icon/call.svg" alt="" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactOne
