/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>Header</div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>Facets</div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>Results</div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);