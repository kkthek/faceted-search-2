/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {DocumentQuery, SolrDocumentsResponse, SolrStatsResponse, StatQuery} from "./datatypes";


class Client {

    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async searchDocuments(query: DocumentQuery
    ): Promise<SolrDocumentsResponse> {
        const response = await fetch(this.url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        return await response.json();
    }

    async searchStats(query: StatQuery
    ): Promise<SolrStatsResponse> {
        const response = await fetch(this.url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        return await response.json();
    }

}

export default Client;