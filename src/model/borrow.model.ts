export class BorrowResponse {
    id: number;
    books_code?: string;
    username?: string;
    return_date?: string;
}

export class BorrowSearchResponse {
    id: number;
    book?: Books;
    user?: User;
    return_date?: string;
}


export class CreateBorrowRequest {
    books_code: string;
}

export class Books {
    code: string;
    stock: number;
    title: string;
    author: string;
}

export class User {
    name: string;
    code: string;
}

export class GetBorrowRequest {
    books_id: number;
    user_id: number;
}

export class UpdateBorrowRequest {
    id: number;
    books_id: number;
    user_id: number;
}

export class RemoveBorrowRequest {
    books_id: number;
    user_id: number;
}

export class SearchBorrowRequest {
    books_code?: string;
    page: number;
    size: number;
}
