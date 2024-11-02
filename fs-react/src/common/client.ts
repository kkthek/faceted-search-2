/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {
    DocumentQuery,
    FacetsQuery,
    SolrDocumentsResponse,
    SolrFacetResponse,
    SolrStatsResponse,
    StatQuery
} from "./datatypes";
import {TypedJSON} from "typedjson";


class Client {

    private readonly baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    async searchDocuments(query: DocumentQuery
    ): Promise<SolrDocumentsResponse> {
        const response = await fetch(this.baseUrl + "/documents", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(SolrDocumentsResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async searchStats(query: StatQuery
    ): Promise<SolrStatsResponse> {
        const response = await fetch(this.baseUrl + "/stats", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(SolrStatsResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async searchFacets(query: FacetsQuery
    ): Promise<SolrFacetResponse> {
        const response = await fetch(this.baseUrl + "/facets", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(SolrFacetResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async handleErrorIfAny(response: Response) {
        if (!response.ok) {
            throw ({
                status: response.status,
                statusText: response.statusText,
                message: await response.text()
            });
        }
    }
}

export default Client;