import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'revampdb',
      entities: ['dist/output/entities/*.js'],
      synchronize: false,
    }),
    GlobalModule,
  ],
})
export class AppModule {}
