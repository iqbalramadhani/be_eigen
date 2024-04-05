export class BooksResponse {
    id: number;
    code: string;
    title?: string;
    author?: string;
    stock?: number;
}

export class CreateBooksRequst {
    code: string;
    title?: string;
    author?: string;
    stock?: number;
}

export class UpdateBooksRequest {
    id: number;
    title?: string;
    author?: string;
    stock?: number;
}

export class SearchBooksRequest {
    title?: string;
    author?: string;
    code?: string;
    page: number;
    size: number;
}

export class GetBookRequest {
    code: string;
}