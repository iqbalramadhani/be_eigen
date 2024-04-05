import { z, ZodType } from 'zod';

export class BooksValidation {
    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(255),
        title: z.string().min(1).max(255).optional(),
        author: z.string().min(1).max(255).optional(),
        stock: z.number().min(1).positive()

    });

    static readonly GET: ZodType = z.object({
        code: z.string().min(1).max(255),
        title: z.string().min(1).max(255).optional(),
        author: z.string().min(1).max(255).optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().min(1).positive(),
        title: z.string().min(1).max(255).optional(),
        author: z.string().min(1).max(255).optional(),
        stock: z.number().min(1).positive()
    });

    static readonly SEARCH: ZodType = z.object({
        title: z.string().min(1).optional(),
        author: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive(),
    });
}