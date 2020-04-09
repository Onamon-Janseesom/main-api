import { CustomerEntity } from './entity/customer.entity';
import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "customer-db.cil1xn4fd9qh.us-east-2.rds.amazonaws.com",
      "port": 3306,
      "username": "admin",
      "password": "313326339",
      "database": 'customer',
      "entities": ["src/entity/**.entity{.ts,.js}"],
      "synchronize": true,
      "logging": true,
    }),
    TypeOrmModule.forFeature([CustomerEntity]),
    HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
