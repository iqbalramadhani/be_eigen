export class RegisterUserRequest {
    username: string;
    password: string;
    name: string;
    code?: string;
    penalized?: boolean;
}

export class UserResponse {
    username: string;
    name: string;
    token?: string;
    code?: string;
    pepenalized?: boolean;

}

export class LoginUserRequest {
    username: string;
    password: string;
}

export class UpdateUserRequest {
    name?: string;
    password?: string;
}