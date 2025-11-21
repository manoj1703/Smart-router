import React, { useState } from 'react';

type Page = 'home' | 'about' | 'dashboard';

export const SmartAirliftRouter: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'about':
                return <About />;
            case 'dashboard':
                return <Dashboard />;
            default:
                return <Home />;
        }
    };

    return (
        <div>
            <nav>
                <button onClick={() => setCurrentPage('home')}>Home</button>
                <button onClick={() => setCurrentPage('about')}>About</button>
                <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
            </nav>
            <div>{renderPage()}</div>
        </div>
    );
};

// Stub components for Home, About, and Dashboard pages
const Home: React.FC = () => (
    <div>
        <h2>Home Page</h2>
        <p>Welcome to the Smart Airlift System!</p>
    </div>
);

const About: React.FC = () => (
    <div>
        <h2>About Page</h2>
        <p>Learn more about the Smart Airlift System.</p>
    </div>
);

const Dashboard: React.FC = () => (
    <div>
        <h2>Dashboard</h2>
        <p>Manage and monitor airlift data here.</p>
    </div>
);
