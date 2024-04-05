import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksResponse, CreateBooksRequst, GetBookRequest, SearchBooksRequest, UpdateBooksRequest } from "../model/books.model";
import { WebResponse } from "../model/web.model";
import { Auth } from "src/common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/api/books')
export class BooksController {
    constructor(private bookService: BooksService) { }

    @Post()
    @HttpCode(200)
    async create(
        @Auth()
        @Body() request: CreateBooksRequst,
    ): Promise<WebResponse<BooksResponse>> {
        const result = await this.bookService.create(request);
        return {
            data: result,
        };
    }

    @Get('/:bookId')
    @HttpCode(200)
    async get(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<WebResponse<BooksResponse>> {
        const result = await this.bookService.get(bookId);
        return {
            data: result,
        };
    }

    @Put('/:bookId')
    @HttpCode(200)
    async update(
        @Param('bookId', ParseIntPipe) bookId: number,
        @Body() request: UpdateBooksRequest,
    ): Promise<WebResponse<BooksResponse>> {
        request.id = bookId
        const result = await this.bookService.update(request);
        return {
            data: result,
        };
    }

    @Delete('/:bookId')
    @HttpCode(200)
    async remove(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<WebResponse<boolean>> {
        await this.bookService.remove(bookId);
        return {
            data: true,
        };
    }

    @Get()
    @HttpCode(200)
    async search(
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('code') code?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    ): Promise<WebResponse<BooksResponse[]>> {

        const request: SearchBooksRequest = {
            title: title,
            author: author,
            code: code,
            page: page || 1,
            size: size || 10
        }

        return this.bookService.search(request)
    }


}
