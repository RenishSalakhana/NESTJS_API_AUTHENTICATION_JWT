import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserServices } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs_user_auth',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:'secret',
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AppController],
  providers: [UserServices],
})
export class AppModule {}
