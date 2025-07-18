import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './creditcalculator.css';

// Credit requirements and limits for each education level
const creditLimits = {
    primary: {
        total: 40,
        theory: { max: 25 },
        practical: { max: 10 },
        experimental: { max: 5 }
    },
    highSchool: {
        total: 60,
        theory: { max: 35 },
        practical: { max: 15 },
        experimental: { max: 10 }
    },
    undergraduate: {
        total: 120,
        theory: { max: 60 },
        practical: { max: 40 },
        experimental: { max: 20 }
    },
    postgraduate: {
        total: 80,
        theory: { max: 35 },
        practical: { max: 25 },
        experimental: { max: 20 }
    },
    phd: {
        total: 100,
        theory: { max: 40 },
        practical: { max: 30 },
        experimental: { max: 30 }
    }
};

const CreditCalculator = () => {
    const [formData, setFormData] = useState({
        educationLevel: 'primary',
        theoryCredits: '',
        practicalCredits: '',
        experimentalCredits: ''
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Get the maximum allowed value based on the field and education level
        let maxValue;
        if (id === 'educationLevel') {
            setFormData(prev => ({
                ...prev,
                [id]: value,
                // Reset credit values when education level changes
                theoryCredits: '',
                practicalCredits: '',
                experimentalCredits: ''
            }));
            return;
        } else {
            const limits = creditLimits[formData.educationLevel];
            maxValue = limits[id.replace('Credits', '')].max;
        }

        // Ensure the value is within bounds (0 to maxValue)
        const numValue = parseInt(value) || 0;

        if (numValue > maxValue) {
            // Show toast notification when exceeding max value
            toast.warning(`Maximum allowed ${id.replace('Credits', '')} credits for ${formData.educationLevel} level is ${maxValue}!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        const boundedValue = Math.min(Math.max(0, numValue), maxValue);

        setFormData(prev => ({
            ...prev,
            [id]: boundedValue === 0 ? '' : boundedValue.toString()
        }));
    };

    const getCurrentLimits = () => creditLimits[formData.educationLevel];

    const calculateCredits = (e) => {
        e.preventDefault();

        const theory = parseInt(formData.theoryCredits) || 0;
        const practical = parseInt(formData.practicalCredits) || 0;
        const experimental = parseInt(formData.experimentalCredits) || 0;

        const totalCredits = theory + practical + experimental;
        const limits = getCurrentLimits();

        setResult({
            totalCredits,
            requiredCredits: limits.total,
            completionPercentage: Math.min(100, (totalCredits / limits.total) * 100).toFixed(1),
            theory,
            practical,
            experimental,
            maxTheory: limits.theory.max,
            maxPractical: limits.practical.max,
            maxExperimental: limits.experimental.max
        });
    };

    return (
        <div className="credit-calculator-page">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="calculator-header">
                <p className="calculator-description">
                    Use this calculator to determine your progress within the National Credit Framework.
                    Enter your completed credits for each category to see your total credits and completion percentage.
                </p>
            </div>

            <div className="calculator-container">
                <form onSubmit={calculateCredits} className="calculator-form">
                    <div className="form-row">
                        <div className="form-group education-level">
                            <label htmlFor="educationLevel">Education Level</label>
                            <select
                                id="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="primary">Primary Education</option>
                                <option value="highSchool">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="postgraduate">Postgraduate</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="theoryCredits">
                                Theory Credits (Max: {getCurrentLimits().theory.max})
                            </label>
                            <input
                                type="number"
                                id="theoryCredits"
                                value={formData.theoryCredits}
                                onChange={handleInputChange}
                                min="0"
                                max={getCurrentLimits().theory.max}
                                step="1"
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="practicalCredits">
                                Practical Credits (Max: {getCurrentLimits().practical.max})
                            </label>
                            <input
                                type="number"
                                id="practicalCredits"
                                value={formData.practicalCredits}
                                onChange={handleInputChange}
                                min="0"
                                max={getCurrentLimits().practical.max}
                                step="1"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="experimentalCredits">
                                Experimental Credits (Max: {getCurrentLimits().experimental.max})
                            </label>
                            <input
                                type="number"
                                id="experimentalCredits"
                                value={formData.experimentalCredits}
                                onChange={handleInputChange}
                                min="0"
                                max={getCurrentLimits().experimental.max}
                                step="1"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <button type="submit" className="calculator-submit">
                            Calculate Credits
                        </button>
                    </div>
                </form>

                {result && (
                    <div className="calculator-result">
                        <h3>Results</h3>
                        <div className="result-grid">
                            <div className="result-item">
                                <p>Total Credits Earned: <span>{result.totalCredits}</span></p>
                            </div>
                            <div className="result-item">
                                <p>Credits Required: <span>{result.requiredCredits}</span></p>
                            </div>
                            <div className="result-item">
                                <p>Completion: <span>{result.completionPercentage}%</span></p>
                            </div>
                        </div>
                        <div className="progress-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${result.completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="info-section">
                <h2>Understanding Credit Categories</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <h3>Theory Credits</h3>
                        <p>Credits earned through classroom learning, lectures, and theoretical understanding of subjects.</p>
                    </div>
                    <div className="info-item">
                        <h3>Practical Credits</h3>
                        <p>Credits earned through laboratory work, hands-on exercises, and practical applications.</p>
                    </div>
                    <div className="info-item">
                        <h3>Experimental Credits</h3>
                        <p>Credits earned through research projects, field work, and experimental learning activities.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCalculator;
