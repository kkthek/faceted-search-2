import React from 'react';
import ReactDOM from 'react-dom/client';
import SolrClient from "./solr_api/solr_client";

function initSolr() {

    let client = new SolrClient('http://localhost:8983/solr/mw');
    let params = client.getParams("test", [], [], [], [], [], "");
    console.log(params.toString());
}

function App() {
    initSolr();
    return <div id={'fs-content'}>
            <div id={'fs-header'} className={'fs-boxes'}>Header</div>
            <div id={'fs-facets'} className={'fs-boxes fs-body'}>Facets</div>
            <div id={'fs-results'} className={'fs-boxes fs-body'}>Results</div>
        </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);