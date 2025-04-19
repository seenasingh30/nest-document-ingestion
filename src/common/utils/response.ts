import { Res } from "@nestjs/common";

export function SuccessResponse<T>(data: T, message: string = 'Success', meta: any = null) {
    return {
        statusCode: 200,
        message,
        data,
        meta
    };
}

export function CreatedResponse<T>(data: T, message: string = 'Created') {
    return {
        statusCode: 201,
        message,
        data,
    };
}

export function NoContentResponse(message: string = 'No Content') {
    return {
        statusCode: 204,
        message,
    };
}

export function BadRequestResponse(message: string = 'Bad Request') {
    return {
        statusCode: 400,
        message,
    };
}

export function UnauthorizedResponse(message: string = 'Unauthorized') {
    return {
        statusCode: 401,
        message,
    };
}

export function ForbiddenResponse(message: string = 'Forbidden') {
    return {
        statusCode: 403,
        message,
    };
}

export function NotFoundResponse(message: string = 'Not Found') {
    return {
        statusCode: 404,
        message,
    };
}

export function ConflictResponse(message: string = 'Conflict') {
    return {
        statusCode: 409,
        message,
    };
}

export function InternalServerErrorResponse(message: string = 'Internal Server Error') {
    return {
        statusCode: 500,
        message,
    };
}