/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {
    DocumentQuery,
    FacetsQuery,
    DocumentsResponse,
    FacetResponse,
    StatsResponse,
    StatQuery, Document
} from "./datatypes";
import {TypedJSON} from "typedjson";


class Client {

    private readonly baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    async searchDocuments(query: DocumentQuery
    ): Promise<DocumentsResponse> {
        const response = await fetch(this.baseUrl + "/documents", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(DocumentsResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async getDocumentById(id: string
    ): Promise<Document> {
        const response = await fetch(this.baseUrl + "/document-by-id", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({id: id})
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(Document);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async searchStats(query: StatQuery
    ): Promise<StatsResponse> {
        const response = await fetch(this.baseUrl + "/stats", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(StatsResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async searchFacets(query: FacetsQuery
    ): Promise<FacetResponse> {
        const response = await fetch(this.baseUrl + "/facets", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(FacetResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async getSettingsForDevContext(): Promise<any> {
        const response = await fetch(this.baseUrl + "/settings", {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        await this.handleErrorIfAny(response);
        return await response.json();
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