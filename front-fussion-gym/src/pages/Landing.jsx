import React from 'react';
import Hero from '../components/Hero';
import WhatIsFussion from '../components/WhatIsFussion';
import Beneficios from '../components/Beneficios';
import Gamification from '../components/Gamification';
import PremiosList from '../components/PremiosList';
import AppMockups from '../components/AppMockups';
import Footer from '../components/Footer';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <Hero />
            <WhatIsFussion />
            <Beneficios />
            <Gamification />
            <PremiosList />
            <AppMockups />
            <Footer />
        </div>
    );
};

export default Landing;
