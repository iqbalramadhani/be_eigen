import { z, ZodType } from 'zod';

export class BorrowValidation {
    static readonly CREATE: ZodType = z.object({
        books_code: z.string().min(1).max(255),
    });

    static readonly GET: ZodType = z.object({
        code: z.string().min(1).max(255),
        title: z.string().min(1).max(255).optional(),
        author: z.string().min(1).max(255).optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().min(1).positive(),
        books_id: z.number().min(1).positive(),
    });

    static readonly SEARCH: ZodType = z.object({
        // title: z.string().min(1).optional(),
        // author: z.string().min(1).optional(),
        // code: z.string().min(1).optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive(),
    });
}