import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/your-database-name'),
  ],
  controllers: [AppController, ItemsController],
  providers: [AppService, ItemsService],
})
export class AppModule {}
