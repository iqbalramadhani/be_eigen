import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { BorrowService } from "./borrow.service";
import { WebResponse } from "../model/web.model";
import { BorrowResponse, BorrowSearchResponse, CreateBorrowRequest, SearchBorrowRequest } from "../model/borrow.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/api/borrow-books')
export class BorrowController {
    constructor(private borrowService: BorrowService) { }

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Body() request: CreateBorrowRequest,
    ): Promise<WebResponse<BorrowResponse>> {
        const result = await this.borrowService.create(user, request);
        return {
            data: result,
        };
    }

    @Get('/:borrowId')
    @HttpCode(200)
    async get(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<WebResponse<BorrowResponse>> {
        const result = await this.borrowService.get(bookId);
        return {
            data: result,
        };
    }

    // @Put('/:bookId')
    // @HttpCode(200)
    // async update(
    //     @Param('bookId', ParseIntPipe) bookId: number,
    //     @Body() request: UpdateBooksRequest,
    // ): Promise<WebResponse<BooksResponse>> {
    //     request.id = bookId
    //     const result = await this.bookService.update(request);
    //     return {
    //         data: result,
    //     };
    // }

    // @Delete('/:bookId')
    // @HttpCode(200)
    // async remove(
    //     @Param('bookId', ParseIntPipe) bookId: number,
    // ): Promise<WebResponse<boolean>> {
    //     await this.bookService.remove(bookId);
    //     return {
    //         data: true,
    //     };
    // }

    @Get()
    @HttpCode(200)
    async search(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    ): Promise<WebResponse<BorrowSearchResponse[]>> {

        const request: SearchBorrowRequest = {
            page: page || 1,
            size: size || 10
        }

        return this.borrowService.search(request)
    }


}
