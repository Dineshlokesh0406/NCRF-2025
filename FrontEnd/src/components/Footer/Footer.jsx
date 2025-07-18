import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className="footer" id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <div className="footer-logo">NCRF</div>
                <p>The National Credit Framework (NCrF) is India's first comprehensive credit framework that integrates credits earned through school education, higher education, and vocational & skill education.</p>
                <div className="footer-social-icon">
                    <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div className="footer-content-center">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About NCrF</a></li>
                    <li><a href="/credit-calculator">Credit Calculator</a></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>Contact Us</h2>
                <ul className="contact-list">
                    <li>
                        <i className="fas fa-envelope"></i>
                        <span>dineshlokesh0406@gmail.com</span>
                    </li>
                    <li>
                        <i className="fas fa-envelope"></i>
                        <span>harshithashivkumar3112@gmail.com</span>
                    </li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright © 2024 National Credit Framework (NCrF). All rights reserved.</p>
    </div>
  )
}

export default Footer