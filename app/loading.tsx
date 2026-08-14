import React from 'react';

const Loading = () => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
                background: '#f8fafc',
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '4px solid #e2e8f0',
                    borderTopColor: '#f59e0b',
                    animation: 'spin 0.7s linear infinite',
                }}
            />
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;