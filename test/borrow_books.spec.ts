import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('BorrowBookController', () => {
  let app: INestApplication;

  let logger: Logger;
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService)
  });

  describe("POST /api/borrow-books", () => {

    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createBook();
    })



    it("should be reject if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/borrow-books')
        .set('Authorization', 'test')
        .send({
          book_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be reject if book not found", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/borrow-books')
        .set('Authorization', 'test')
        .send({
          books_code: 'warning',
        });

      logger.info(response);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined()
    })

    it("should be able to create borow book", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/borrow-books')
        .set('Authorization', 'test')
        .send({
          books_code: 'test',
        });

      logger.info(response);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.books_code).toBe('test')
      expect(response.body.data.username).toBe('test')
    })

    it("should be reject if borrow same book", async () => {

      await testService.createBorrowBooks

      const response = await request(app.getHttpServer())
        .post('/api/borrow-books')
        .set('Authorization', 'test')
        .send({
          books_code: 'test',
        });

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined()
    })

  })

  // describe("GET /api/books/:bookId", () => {

  //   beforeEach(async () => {
  //     await testService.deleteAll();
  //     await testService.createUser();
  //     await testService.createBook();
  //   })

  //   it("should be reject if book is not found", async () => {

  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books/${book.id + 1}`)
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(404);
  //     expect(response.body.errors).toBeDefined();
  //   })

  //   it("should be able to get book", async () => {
  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books/${book.id}`)
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.id).toBeDefined()
  //     expect(response.body.data.code).toBe('test');
  //     expect(response.body.data.title).toBe('test');
  //     expect(response.body.data.author).toBe('test');
  //     expect(response.body.data.stock).toBe(1);
  //   })
  // })

  // describe("PUT /api/books/:bookdId", () => {

  //   beforeEach(async () => {
  //     await testService.deleteAll();
  //     await testService.createUser();
  //     await testService.createBook();
  //   })

  //   it("should be reject if request update is invalid", async () => {
  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .put(`/api/books/${book.id}`)
  //       .set('Authorization', 'test')
  //       .send({
  //         code: '',
  //         title: '',
  //         author: 'test',
  //         stock: 1
  //       });

  //     logger.info(response.body);

  //     expect(response.status).toBe(400);
  //     expect(response.body.errors).toBeDefined();
  //   })

  //   it("should be reject if books is not found", async () => {
  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .put(`/api/books/${book.id + 1}`)
  //       .set('Authorization', 'test')
  //       .send({
  //         title: 'test',
  //         author: 'test',
  //         stock: 2
  //       });

  //     logger.info(response.body);

  //     expect(response.status).toBe(404);
  //     expect(response.body.errors).toBeDefined();
  //   })

  //   it("should be able to update book", async () => {
  //     const books = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .put(`/api/books/${books.id}`)
  //       .set('Authorization', 'test')
  //       .send({
  //         title: 'test update',
  //         author: 'test update',
  //         stock: 2
  //       });

  //     logger.info(response);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.id).toBeDefined()
  //     expect(response.body.data.code).toBe('test');
  //     expect(response.body.data.title).toBe('test update');
  //     expect(response.body.data.author).toBe('test update');
  //     expect(response.body.data.stock).toBe(2);
  //   })
  // })

  // describe("DELETE /api/books/:bookId", () => {

  //   beforeEach(async () => {
  //     await testService.deleteAll();
  //     await testService.createUser();
  //     await testService.createBook();
  //   })

  //   it("should be reject if book is not found", async () => {
  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .delete(`/api/books/${book.id + 1}`)
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(404);
  //     expect(response.body.errors).toBeDefined();
  //   })

  //   it("should be able to remove book", async () => {
  //     const book = await testService.getBook();
  //     const response = await request(app.getHttpServer())
  //       .delete(`/api/books/${book.id}`)
  //       .set('Authorization', 'test')

  //     logger.info(response);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data).toBe(true)
  //   })
  // })

  // describe("GET /api/books", () => {

  //   beforeEach(async () => {
  //     await testService.deleteAll();
  //     await testService.createUser();
  //     await testService.createBook();
  //   })

  //   it("should be able to search book", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books`)
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(1);
  //   })

  //   it("should be able to search contacts by tile", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books`)
  //       .query({
  //         title: 'es'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(1);
  //   })

  //   it("should be able to search books by author", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books`)
  //       .query({
  //         author: 'es'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(1);
  //   })

  //   it("should be able to search books by code", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books`)
  //       .query({
  //         code: 'es'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(1);
  //   })

  //   it("should be able to search books by title not found", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/contacts`)
  //       .query({
  //         title: 'wrong'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(0);
  //   })

  //   it("should be able to search books by author not found", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/contacts`)
  //       .query({
  //         author: 'wrong'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(0);
  //   })

  //   it("should be able to search books by code not found", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/contacts`)
  //       .query({
  //         author: 'wrong'
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(0);
  //   })


  //   it("should be able to search contacts with page", async () => {
  //     const response = await request(app.getHttpServer())
  //       .get(`/api/books`)
  //       .query({
  //         page: 2,
  //         size: 1
  //       })
  //       .set('Authorization', 'test')

  //     logger.info(response.body);

  //     expect(response.status).toBe(200);
  //     expect(response.body.data.length).toBe(0);
  //     expect(response.body.paging.current_page).toBe(2);
  //     expect(response.body.paging.total_page).toBe(1);
  //     expect(response.body.paging.size).toBe(1);
  //   })
  // })

});
