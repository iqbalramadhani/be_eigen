import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { BorrowValidation } from "./borrow.validation";
import { BorrowResponse, BorrowSearchResponse, CreateBorrowRequest, SearchBorrowRequest, UpdateBorrowRequest } from "src/model/borrow.model";
import { addDays } from 'date-fns';
import { WebResponse } from "src/model/web.model";
import { Borrow, User } from "@prisma/client";


@Injectable()
export class BorrowService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) { }

    async create(
        user: User,
        request: CreateBorrowRequest,
    ): Promise<BorrowResponse> {
        this.logger.info(`BorrowService.create(${JSON.stringify(request)})`)

        const createRequest: CreateBorrowRequest = this.validationService.validate(
            BorrowValidation.CREATE,
            request,
        );

        if (user.penalized) {
            const currentDate = new Date();
            const itemDate = new Date(user.penalized_date);

            if (itemDate < currentDate) {
                throw new HttpException(`Akun anda masih terkena perlanggaran sampai tanggal ${itemDate.getDate}`, 400)
            } else {
                user = await this.prismaService.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        penalized: false,
                        penalized_date: null
                    }
                });
            }
        }

        const checkBorrowBooks = await this.prismaService.borrow.findMany({
            where: {
                username: user.username,
            }
        })

        if (checkBorrowBooks.length > 2) {
            throw new HttpException('Masih ada pinjaman buku yang belum di kembalikan', 400)
        }

        checkBorrowBooks.map((borrow) => {
            if (borrow.book_code == createRequest.books_code) {
                throw new HttpException('Buku yang di pinjam tidak boleh sama', 400)
            }
        })

        const checkBooks = await this.prismaService.books.findFirst({
            where: {
                code: createRequest.books_code,
                stock: {
                    gt: 0
                }
            }
        })

        if (!checkBooks) {
            throw new HttpException('Buku yang di pinjam tidak ada', 404)
        }

        const currentDate = new Date();
        const nextSevenDays = addDays(currentDate, 7);

        const borrowBook = await this.prismaService.borrow.create({
            data: {
                book_code: request.books_code,
                username: user.username,
                return_date: nextSevenDays
            },
        });

        return this.toBorrowBooksResponse(borrowBook)
    }

    toBorrowBooksResponse(borrow: Borrow): BorrowResponse {
        return {
            id: borrow.id,
            books_code: borrow.book_code,
            username: borrow.username,
            return_date: borrow.return_date.toDateString()
        }
    }

    async checkBorrowMustExist(
        borrowId: number,
    ): Promise<Borrow> {
        const borrows = await this.prismaService.borrow.findFirst({
            where: {
                id: borrowId
            }
        });

        if (!borrows) {
            throw new HttpException('Borrows Books is not found', 404);
        }

        return borrows
    }

    async get(borrowId: number): Promise<BorrowResponse> {
        const books = await this.checkBorrowMustExist(borrowId)
        return this.toBorrowBooksResponse(books)
    }

    async update(
        user: User,
        request: UpdateBorrowRequest
    ): Promise<BorrowResponse> {
        const updateRequest = this.validationService.validate(
            BorrowValidation.UPDATE,
            request
        );

        let borrow = await this.checkBorrowMustExist(
            updateRequest.id
        )

        borrow = await this.prismaService.borrow.update({
            where: {
                id: borrow.id,
                book_code: borrow.book_code,
                username: user.username
            },
            data: updateRequest
        });

        return this.toBorrowBooksResponse(borrow)
    }

    async remove(borrowId: number): Promise<BorrowResponse> {
        let borrowBooks = await this.checkBorrowMustExist(borrowId);
        borrowBooks = await this.prismaService.borrow.delete({
            where: {
                id: borrowBooks.id,
            }
        });

        return this.toBorrowBooksResponse(borrowBooks)
    }

    async search(
        request: SearchBorrowRequest,
    ): Promise<WebResponse<BorrowSearchResponse[]>> {
        const searchRequest: SearchBorrowRequest = this.validationService.validate(
            BorrowValidation.SEARCH,
            request
        );

        const filters = [];

        const skip = (searchRequest.page - 1) * searchRequest.size

        const borrow = await this.prismaService.borrow.findMany({
            where: {
                AND: filters
            },
            include: {
                book: true,
                user: true
            },
            take: searchRequest.size,
            skip: skip
        })

        const total = await this.prismaService.borrow.count({
            where: {
                AND: filters,
            },
        })

        const data: BorrowSearchResponse[] = borrow.map(b => ({
            id: b.id,
            book: {
                author:b.book.author,
                code:b.book.code,
                stock:b.book.stock,
                title:b.book.title
            },
            user: {
                name:b.user.name,
                code:b.user.code
            },
            return_date: b.return_date.toDateString()
        }));


        return {
            data: data,
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(total / searchRequest.size)
            }
        }
    }
}
