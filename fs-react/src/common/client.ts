/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {Document, DocumentQuery, DocumentsResponse, FacetResponse, FacetsQuery} from "./datatypes";
import {TypedJSON} from "typedjson";

const HTTP_REQUEST_OPTIONS: any = {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer"
}

class Client {

    private readonly baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    async searchDocuments(query: DocumentQuery): Promise<DocumentsResponse> {
        const response = await fetch(this.baseUrl + "/documents", {
            ...HTTP_REQUEST_OPTIONS,
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(DocumentsResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async getDocumentById(id: string): Promise<Document> {
        const response = await fetch(this.baseUrl + "/document-by-id", {
            ...HTTP_REQUEST_OPTIONS,
            body: JSON.stringify({id: id})
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(Document);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async searchFacets(query: FacetsQuery): Promise<FacetResponse> {
        const response = await fetch(this.baseUrl + "/facets", {
            ...HTTP_REQUEST_OPTIONS,
            body: JSON.stringify(query)
        });
        await this.handleErrorIfAny(response);
        const deserializer = new TypedJSON(FacetResponse);
        const json = await response.json();
        return deserializer.parse(json);
    }

    async getCustomEndpoint(url: string): Promise<any> {
        const response = await fetch(url, {
            ...HTTP_REQUEST_OPTIONS
        });
        await this.handleErrorIfAny(response);
        return await response.json();
    }

    async getSettingsForDevContext(): Promise<any> {
        const response = await fetch(this.baseUrl + "/settings", {
            ...HTTP_REQUEST_OPTIONS
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