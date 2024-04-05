import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Books, Contact, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { ContactResponse, CreateContactRequst, SearchContactRequest, UpdateContactRequest } from "src/model/contact.model";
import { Logger } from "winston";
import { WebResponse } from "src/model/web.model";
import { BooksResponse, CreateBooksRequst, SearchBooksRequest, UpdateBooksRequest } from "src/model/books.model";
import { BooksValidation } from "./books.validation";

@Injectable()
export class BooksService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) { }

    async create(
        request: CreateBooksRequst,
    ): Promise<BooksResponse> {
        this.logger.info(`BooksService.create(${JSON.stringify(request)})`)
        const createRequest: CreateBooksRequst = this.validationService.validate(
            BooksValidation.CREATE,
            request,
        );

        const checkBooksCode = await this.prismaService.books.count({
            where: {
                code: createRequest.code,
            }
        })

        if (checkBooksCode != 0) {
            throw new HttpException('Books code already exist', 400)
        }

        const books = await this.prismaService.books.create({
            data: {
                code: createRequest.code,
                author: createRequest.author,
                title: createRequest.title,
                stock: createRequest.stock
            },
        });

        return this.toBooksResponse(books)
    }

    toBooksResponse(books: Books): BooksResponse {
        return {
            code: books.code,
            author: books.author,
            title: books.title,
            stock: books.stock,
            id: books.id
        }
    }

    async checkBooksMustExist(
        bookId: number,
    ): Promise<Books> {
        const book = await this.prismaService.books.findFirst({
            where: {
                id: bookId
            }
        });

        if (!book) {
            throw new HttpException('Books is not found', 404);
        }

        return book
    }

    async get(bookId: number): Promise<BooksResponse> {
        const books = await this.checkBooksMustExist(bookId)
        return this.toBooksResponse(books)
    }

    async update(
        request: UpdateBooksRequest
    ): Promise<BooksResponse> {
        const updateRequest = this.validationService.validate(
            BooksValidation.UPDATE,
            request
        );

        let book = await this.checkBooksMustExist(
            updateRequest.id
        )

        book = await this.prismaService.books.update({
            where: {
                id: book.id,
                code: book.code,
            },
            data: updateRequest
        });

        return this.toBooksResponse(book)
    }

    async remove(bookId: number): Promise<BooksResponse> {
        let book = await this.checkBooksMustExist(bookId);

        book = await this.prismaService.books.delete({
            where: {
                id: book.id,
            }
        });

        return this.toBooksResponse(book)
    }

    async search(
        request: SearchBooksRequest,
    ): Promise<WebResponse<BooksResponse[]>> {
        const searchRequest: SearchBooksRequest = this.validationService.validate(
            BooksValidation.SEARCH,
            request
        );

        const filters = [];

        if (searchRequest) {
            filters.push({
                OR: [
                    {
                        title: {
                            contains: searchRequest.title
                        }
                    },
                    {
                        author: {
                            contains: searchRequest.author
                        }
                    },
                    {
                        code: {
                            contains: searchRequest.code
                        }
                    }
                ]
            })
        }

        if (searchRequest.title) {
            filters.push({
                title: {
                    contains: searchRequest.title
                }
            })
        }

        if (searchRequest.author) {
            filters.push({
                author: {
                    contains: searchRequest.author
                }
            })
        }

        if (searchRequest.code) {
            filters.push({
                code: {
                    contains: searchRequest.code
                }
            })
        }

        const skip = (searchRequest.page - 1) * searchRequest.size

        const book = await this.prismaService.books.findMany({
            where: {
                AND: filters
            },
            take: searchRequest.size,
            skip: skip
        })

        const total = await this.prismaService.books.count({
            where: {
                AND: filters,
            },
        })

        return {
            data: book.map((book) => this.toBooksResponse(book)),
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(total / searchRequest.size)
            }
        }
    }
}
