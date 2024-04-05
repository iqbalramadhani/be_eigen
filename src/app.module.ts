import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { AddressModule } from './address/address.module';
import { BookModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [CommonModule, UserModule, ContactModule, AddressModule, BookModule, BorrowModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
