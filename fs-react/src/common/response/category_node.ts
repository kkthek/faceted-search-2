import {jsonArrayMember, jsonMember, jsonObject} from "typedjson";

@jsonObject
export class CategoryNode {
    @jsonMember(String)
    category: string;

    @jsonMember(String)
    displayTitle: string | null;

    @jsonArrayMember(() => CategoryNode)
    children: CategoryNode[];

    parent: CategoryNode | null;

    constructor(category: string, children: CategoryNode[], displayTitle: string = null) {
        this.category = category;
        this.children = children;
        this.displayTitle = displayTitle;
    }

    createParentReferences(node: CategoryNode | null = null): CategoryNode {
        if (node === null) node = this;
        node.children.forEach(child => {
            child.parent = node;
            this.createParentReferences(child);
        });
        return node;
    }

    private contains(text: string) {
        const parts = text.split(/\s+/);
        return parts.every(part => this.category.toLowerCase().includes(part.toLowerCase())
            || (this.displayTitle && this.displayTitle.toLowerCase().includes(part.toLowerCase())));
    }

    filterForText(text: string): CategoryNode {
        if (text.trim() === '') return this;
        const allMatchingNodes = this.filterNodes_((c) => c.contains(text), this);
        if (allMatchingNodes.length === 0) return new CategoryNode("__ROOT__", []);
        const allCategoriesOnPath = this.getCategoriesOnPathToRoot(allMatchingNodes);
        return this.copyTree_((c) => allCategoriesOnPath.includes(c.category), this)
            .createParentReferences();
    }

    filterForCategories(categories: string[]): CategoryNode {
        if (categories.length === 0) return this;
        const allMatchingNodes = this.filterNodes_((c) => categories.includes(c.category), this);
        if (allMatchingNodes.length === 0) return new CategoryNode("__ROOT__", []);
        const allCategoriesOnPath = this.getCategoriesOnPathToRoot(allMatchingNodes);
        return this.copyTree_((c) => allCategoriesOnPath.includes(c.category), this)
            .createParentReferences();
    }

    getNodeItemIds(node: CategoryNode = this): string[] {
        const found = node.children.map(child => child.category + child.parent?.category)
            .concat(node.parent ? node.category + node.parent.category : node.category);
        node.children.forEach(node => found.push(...this.getNodeItemIds(node)));
        return found;
    }

    private getCategoriesOnPathToRoot(allMatchingNodes: CategoryNode[]) {
        const allCategoriesOnPath: any = {};
        allMatchingNodes.forEach(node => {
            do {
                allCategoriesOnPath[node.category] = true;
                node = node.parent;
            } while (node !== undefined)
        });
        return Object.keys(allCategoriesOnPath);
    }

    private copyTree_(predicate: (node: CategoryNode) => boolean, node: CategoryNode): CategoryNode {
        if (!predicate(node)) return null;
        const newNode = new CategoryNode(node.category, [], node.displayTitle);
        node.children
            .filter(child => predicate(child))
            .forEach(child => {
                const c = this.copyTree_(predicate, child);
                if (c !== null) {
                    newNode.children.push(c);
                }
            });
        return newNode;
    }

    private filterNodes_(predicate: (child: CategoryNode) => boolean, node: CategoryNode) {
        const found = node.children.filter(child => predicate(child));
        node.children.forEach(node => found.push(...this.filterNodes_(predicate, node)));
        return found;
    }
}