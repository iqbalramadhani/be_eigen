import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Address, Books, Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteAll() {
        await this.deleteAddress();
        await this.deleteContact();
        await this.deleteUser();
        await this.deleteBook();
        await this.deleteBorrowBooks();
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test',
            },
        });
    }

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test',
            },
        });
    }

    async deleteBook() {
        await this.prismaService.books.deleteMany({
            where: {
                code: 'test',
            },
        });
    }

    async deleteBorrowBooks() {
        await this.prismaService.borrow.deleteMany({
            where: {
                book_code: 'test',
            },
        });
    }

    async getUser(): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                username: 'test',
            },
        });
    }

    async createUser() {

        const lastEntry = await this.prismaService.user.findFirst({
            orderBy: { id: 'desc' },
        });

        let lastID = 'M000';
        if (lastEntry) {
            lastID = lastEntry.code;
        }

        const numericPart = parseInt(lastID.substring(1));
        const nextNumericPart = numericPart + 1;
        const nextID = `M${nextNumericPart.toString().padStart(3, '0')}`;

        const user = await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test',
                code: nextID,
                penalized: false
            },
        });

        return user
    }

    async createBook() {
        const book = await this.prismaService.books.create({
            data: {
                code: 'test',
                author: 'test',
                title: 'test',
                stock: 1,
            },
        });

        return book
    }

    async getContact(): Promise<Contact> {
        return this.prismaService.contact.findFirst({
            where: {
                username: 'test',
            },
        });
    }

    async getBook(): Promise<Books> {
        return this.prismaService.books.findFirst({
            where: {
                code: 'test',
            },
        });
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '9999',
                username: 'test',
            },
        });
    }

    async createBorrowBooks() {
        await this.prismaService.borrow.create({
            data: {
                book_code: 'test',
                username: 'test',
            },
        });
    }

    async deleteAddress() {
        await this.prismaService.address.deleteMany({
            where: {
                contact: {
                    username: 'test',
                },
            },
        });
    }

    async createAddress() {
        const contact = await this.getContact();
        await this.prismaService.address.create({
            data: {
                contact_id: contact.id,
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: 'negara test',
                postal_code: '1111',
            },
        });
    }

    async getAddress(): Promise<Address> {
        return this.prismaService.address.findFirst({
            where: {
                contact: {
                    username: 'test',
                },
            },
        });
    }
}