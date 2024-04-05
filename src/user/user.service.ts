import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { Logger } from "winston";
import { UserValidation } from "./user.validation";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ) { }

    async register(request: RegisterUserRequest):
        Promise<UserResponse> {
        this.logger.debug(`Register new user ${JSON.stringify(request)}`);
        const registerRequest: RegisterUserRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request
        );

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username,
            }
        })

        if (totalUserWithSameUsername != 0) {
            throw new HttpException('Username already exist', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const lastEntry = await this.prismaService.user.findFirst({
            orderBy: { id: 'desc' },
        });

        let lastID = 'M000';
        if (lastEntry) {
            lastID = lastEntry.code;
        }

        const numericPart = parseInt(lastID.substring(1)); // Extract numeric part
        const nextNumericPart = numericPart + 1;
        const nextID = `M${nextNumericPart.toString().padStart(3, '0')}`; // Format to M001

        registerRequest.code = nextID
        registerRequest.penalized = false;

        const user = await this.prismaService.user.create({
            data: registerRequest,
        });

        return this.toBorrowBooksResponse(user)
    }

    toBorrowBooksResponse(user: User): UserResponse {
        return {
            username: user.username,
            name: user.name,
            code: user.code,
            token: user.token,
            pepenalized: user.penalized

        }
    }


    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.debug(`UserService.login(${JSON.stringify(request)})`)

        const loginRequest: LoginUserRequest = this.validationService.validate(
            UserValidation.Login,
            request
        );

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if (!user) {
            throw new HttpException('Username or password is invalid', 401)
        }

        const isPasswordValid = await bcrypt.compare(
            loginRequest.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new HttpException('Username or password is invalid', 401)
        }

        user = await this.prismaService.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        });

        return this.toBorrowBooksResponse(user)
    }

    async get(user: User): Promise<UserResponse> {
        return {
            username: user.username,
            name: user.name
        }
    }

    async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        this.logger.debug(`UserService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`)

        const updateRequest: UpdateUserRequest = this.validationService.validate(
            UserValidation.UPDATE,
            request
        );

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await this.prismaService.user.update({
            where: {
                username: user.username,
            },
            data: user
        })

        return {
            name: result.name,
            username: result.username
        }
    }

    async logout(user: User): Promise<UserResponse> {
        this.logger.debug(`UserService.logout(${JSON.stringify(user)}`)

        const result = await this.prismaService.user.update({
            where: {
                username: user.username,
            },
            data: {
                token: null
            }
        })

        return {
            name: result.name,
            username: result.username
        }
    }
}