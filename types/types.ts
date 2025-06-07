export type BookCategory = 'comic_issue' | 'graphic_novel';
export interface Book {
    id: string;
    name: string;
    Cover_Image: string | null;
    description: string;
    price: { price: string; currency: string }[] | null;
    category: string;
    release_date?: string;
    parent_id: string | null;
    issues?: Book[];
    created_at?: string;
}

export type ComicIssue = {
    id: string;
    book_id: string;
    issue_number: number;
    title: string;
    storage_path: string;
};


export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    subscribed?: boolean;
    created_at?: string;

}

