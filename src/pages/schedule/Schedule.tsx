import React, { useState, useEffect, useCallback } from 'react';
import SEO from '../../components/navigation/SEO';
import { assetPath } from '../../utils/assetPath';
import './Schedule.css';

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

const Schedule: React.FC = () => {
    const calculateTimeLeft = useCallback((targetDate: string): CountdownTime => {
        const difference = +new Date(targetDate) - +new Date();
        
        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false
        };
    }, []);

    const [round1Time, setRound1Time] = useState<CountdownTime>(calculateTimeLeft('2026-03-16T09:00:00'));
    const [finalTime, setFinalTime] = useState<CountdownTime>(calculateTimeLeft('2026-03-23T09:00:00'));

    useEffect(() => {
        const timer = setInterval(() => {
            setRound1Time(calculateTimeLeft('2026-03-16T09:00:00'));
            setFinalTime(calculateTimeLeft('2026-03-23T09:00:00'));
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const addToCalendar = (title: string, date: string, description: string) => {
        const start = date.replace(/-|:|\.\d\d\d/g, "");
        const end = (parseInt(start) + 1).toString(); // Simple 1 day end
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent('Zeal College, Pune')}`;
        window.open(url, '_blank');
    };

    const schedulePhases = [
        {
            id: 'round1',
            title: 'Phase 01: The Selection Heats',
            date: 'March 16 - 17, 2026',
            targetDate: '20260316T090000',
            countdown: round1Time,
            description: 'Where the journey begins. Hundreds of participants across 5 categories will battle it out for a spot in the grand finale.',
            highlights: [
                { day: '16th March', events: 'Music & Dance Auditions', note: 'High-energy rhythmic sets and vocal mastery.' },
                { day: '17th March', events: 'Drama & Street Play', note: 'Powerful storytelling and social impact performances.' }
            ],
            color: '#ff0059'
        },
        {
            id: 'finals',
            title: 'Phase 02: The Grand Spotlight',
            date: 'March 23, 2026',
            targetDate: '20260323T090000',
            countdown: finalTime,
            description: 'The ultimate stage. Only the finest selected talents return to perform under the big lights for the championship titles.',
            highlights: [
                { day: '23rd March', events: 'Main Stage Finale', note: 'Mega performances followed by Grand Prize distribution.' }
            ],
            color: '#00d1ff'
        }
    ];

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="schedule-page">
            <SEO 
                title="Event Schedule & Live Timers | Talentron '26"
                description="Live countdown to Talentron '26. Check the schedule for Round 1 (March 16-17) and the Grand Finale (March 23)."
            />

            <div className="schedule-container">
                <header className="schedule-header">
                    <img 
                        src={assetPath('/assets/logos/schedule.png')} 
                        alt="Event Schedule" 
                        className="schedule-title-img"
                    />
                </header>

                <div className="phases-list">
                    {schedulePhases.map((phase) => (
                        <div key={phase.id} className="phase-card" style={{ '--phase-color': phase.color } as any}>
                            <div className="phase-header">
                                <div className="phase-info">
                                    <span className="phase-date-label">{phase.date}</span>
                                    <h2 className="phase-title">{phase.title}</h2>
                                </div>
                                <button 
                                    className="calendar-btn"
                                    onClick={() => addToCalendar(phase.title, phase.id === 'round1' ? '20260316' : '20260323', phase.description)}
                                    title="Add to Google Calendar"
                                >
                                    <span>Add to Calendar</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className="timer-wrapper">
                                {phase.countdown.isExpired ? (
                                    <div className="timer-live-badge">LIVE NOW</div>
                                ) : (
                                    <div className="timer-grid">
                                        <div className="timer-unit">
                                            <span className="unit-val">{formatNumber(phase.countdown.days)}</span>
                                            <span className="unit-label">DAYS</span>
                                        </div>
                                        <div className="timer-sep">:</div>
                                        <div className="timer-unit">
                                            <span className="unit-val">{formatNumber(phase.countdown.hours)}</span>
                                            <span className="unit-label">HRS</span>
                                        </div>
                                        <div className="timer-sep">:</div>
                                        <div className="timer-unit">
                                            <span className="unit-val">{formatNumber(phase.countdown.minutes)}</span>
                                            <span className="unit-label">MINS</span>
                                        </div>
                                        <div className="timer-sep">:</div>
                                        <div className="timer-unit">
                                            <span className="unit-val">{formatNumber(phase.countdown.seconds)}</span>
                                            <span className="unit-label">SECS</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="phase-content">
                                <p className="phase-desc">{phase.description}</p>
                                <div className="highlights-grid">
                                    {phase.highlights.map((item, idx) => (
                                        <div key={idx} className="highlight-item">
                                            <div className="highlight-dot"></div>
                                            <div className="highlight-text">
                                                <strong>{item.day}:</strong> {item.events}
                                                <p className="highlight-note">{item.note}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="schedule-footer-note">
                    <p>
                        All events will be held at <a href="https://maps.app.goo.gl/RXpzvbPwm4s2CqDW6" target="_blank" rel="noopener noreferrer" className="venue-link">Zeal Institutes, Pune (Narhe Campus)</a>.
                        <br />
                        Reporting Time will be shared to participants via WhatsApp and Email.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
