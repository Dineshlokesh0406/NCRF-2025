import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'key-features', 'implementation', 'benefits', 'statistics', 'faq'];

            // Get all section elements with their positions
            const sectionElements = sections.map(id => {
                const element = document.getElementById(id);
                if (!element) return null;

                const rect = element.getBoundingClientRect();
                return {
                    id,
                    top: rect.top,
                    bottom: rect.bottom,
                    height: rect.height,
                    element
                };
            }).filter(Boolean);

            // Find which section is most visible in the viewport
            let mostVisibleSection = null;
            let maxVisibleHeight = 0;

            const viewportHeight = window.innerHeight;

            for (const section of sectionElements) {
                // Calculate how much of the section is visible in the viewport
                const visibleTop = Math.max(0, section.top);
                const visibleBottom = Math.min(viewportHeight, section.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                // If this section has more visible area than previous ones, it becomes the active one
                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    mostVisibleSection = section.id;
                }
            }

            // If we found a visible section, set it as active
            if (mostVisibleSection) {
                setActiveSection(mostVisibleSection);
            } else if (sectionElements.length > 0) {
                // If no section is visible (rare case), check if we're above the first section
                if (sectionElements[0].top > 0) {
                    setActiveSection('overview');
                } else {
                    // Or below the last section
                    setActiveSection(sectionElements[sectionElements.length - 1].id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once on mount to set initial active section
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="about-page">
            <div className="about-hero">
                <h1>National Credit Framework (NCrF)</h1>
                <p>A revolutionary approach to education that integrates academic, vocational, and experiential learning into a unified credit-based system.</p>
            </div>

            <nav className="about-nav">
                <ul>
                    <li><a href="#overview" className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
                    <li><a href="#key-features" className={activeSection === 'key-features' ? 'active' : ''}>Key Features</a></li>
                    <li><a href="#implementation" className={activeSection === 'implementation' ? 'active' : ''}>Implementation</a></li>
                    <li><a href="#benefits" className={activeSection === 'benefits' ? 'active' : ''}>Benefits</a></li>
                    <li><a href="#statistics" className={activeSection === 'statistics' ? 'active' : ''}>Statistics</a></li>
                    <li><a href="#faq" className={activeSection === 'faq' ? 'active' : ''}>FAQ</a></li>
                </ul>
            </nav>

            <main>
                <section id="overview" className="content-section">
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>What is NCrF?</h2>
                        </div>
                        <div className="info-card-content">
                            <p>The National Credit Framework (NCrF) is India's first comprehensive credit framework that integrates credits earned through school education, higher education, and vocational & skill education. It enables the design of new pathways that integrate academic and vocational education.</p>

                            <div className="feature-grid">
                                <div className="feature-item">
                                    <h3>Credit Recognition</h3>
                                    <p>Recognizes learning across academic, vocational, and experiential domains.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Flexible Learning</h3>
                                    <p>Multiple entry and exit options with credit transfer facility.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Unified System</h3>
                                    <p>Integrates credits from different education streams.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="key-features" className="content-section">
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>Credit Assignment</h3>
                                <p>1 credit equals 30 notional learning hours, covering classroom instruction, lab work, and field projects.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>Credit Levels</h3>
                                <p>Eight credit levels from school education to research, aligned with global standards.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>Credit Bank</h3>
                                <p>Academic Bank of Credits (ABC) for storing and transferring credits digitally.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-content">
                                <h3>Industry Integration</h3>
                                <p>Recognition of workplace learning and industry certifications.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="implementation" className="content-section">
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>Implementation Strategy</h2>
                        </div>
                        <div className="info-card-content">
                            <div className="feature-grid">
                                <div className="feature-item">
                                    <h3>Phase 1: Foundation</h3>
                                    <p>Setting up credit recognition systems and digital infrastructure for seamless credit transfer.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Phase 2: Integration</h3>
                                    <p>Connecting educational institutions and implementing standardized credit assessment.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Phase 3: Industry Alignment</h3>
                                    <p>Establishing partnerships with industry for workplace learning recognition.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Phase 4: Full Deployment</h3>
                                    <p>Nationwide rollout with continuous monitoring and improvement mechanisms.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="content-section">
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>Benefits of NCrF</h2>
                        </div>
                        <div className="info-card-content">
                            <div className="benefit-grid">
                                <div className="benefit-item">
                                    <h3>Students</h3>
                                    <ul>
                                        <li>Flexible learning pathways</li>
                                        <li>Recognition of prior learning</li>
                                        <li>Enhanced employability</li>
                                    </ul>
                                </div>
                                <div className="benefit-item">
                                    <h3>Institutions</h3>
                                    <ul>
                                        <li>Standardized credit system</li>
                                        <li>Improved quality assurance</li>
                                        <li>Global alignment</li>
                                    </ul>
                                </div>
                                <div className="benefit-item">
                                    <h3>Industry</h3>
                                    <ul>
                                        <li>Skilled workforce</li>
                                        <li>Industry-academia collaboration</li>
                                        <li>Standardized assessment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="statistics" className="content-section">
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>NCrF Statistics</h2>
                        </div>
                        <div className="info-card-content">
                            <div className="feature-grid">
                                <div className="feature-item">
                                    <h3>8+ Levels</h3>
                                    <p>Credit levels from school to research, aligned with global standards</p>
                                </div>
                                <div className="feature-item">
                                    <h3>30 Hours</h3>
                                    <p>Per credit of learning, including classroom, practical, and self-study</p>
                                </div>
                                <div className="feature-item">
                                    <h3>100+</h3>
                                    <p>Institutions participating in the initial phase</p>
                                </div>
                                <div className="feature-item">
                                    <h3>24/7</h3>
                                    <p>Digital access to Academic Bank of Credits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="faq" className="content-section">
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2>Frequently Asked Questions</h2>
                        </div>
                        <div className="info-card-content">
                            <div className="faq-list">
                                <div className="faq-item">
                                    <h3>How are credits calculated?</h3>
                                    <p>Credits are calculated based on notional learning hours, where 1 credit equals 30 hours of learning including classroom teaching, practical work, and self-study.</p>
                                </div>
                                <div className="faq-item">
                                    <h3>Can I transfer credits between institutions?</h3>
                                    <p>Yes, NCrF facilitates credit transfer between recognized institutions through the Academic Bank of Credits (ABC).</p>
                                </div>
                                <div className="faq-item">
                                    <h3>Is work experience counted for credits?</h3>
                                    <p>Yes, NCrF recognizes prior learning and work experience through a standardized assessment process.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;