import { Controller, Body, Post, BadRequestException,Res,Get,Req,UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserServices } from './app.service';
import {JwtService} from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('api')
export class AppController {
  constructor(private readonly userServices: UserServices,
    private jwtService: JwtService
    ) {}


  // register
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const saltOrRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

   const user = await this.userServices.create({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return user
  }

  // login
  @Post('login')
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({passthrough:true}) response : Response
  ) {

    const user = await this.userServices.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

   const jwt = await this.jwtService.signAsync({id:user.id});

   response.cookie('jwt', jwt, {httpOnly: true});

    return {
      message :"Success!"
    }
  }

  @Get('user')
  async user(@Req() request: Request) {
    try{
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if(!data)
      {
        throw new UnauthorizedException();
      }
 
      const user = await this.userServices.findOne({where : {id:data['id']}});

      const {password , ...result } = user; //this will be remove password in response as it hashed so no need

      return result;
     }
     catch(e){
      throw new UnauthorizedException();

     }
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');

      return {
          message: 'success'
      }
  }
}
