import { BookingDto } from './dto/booking.dto';
import { StatusDto } from './dto/status.dto';
import { Controller, Get, Body, HttpStatus, Res, Post, Query, HttpService } from '@nestjs/common';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly http: HttpService,) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/index')
  getAllDetails(@Res() res): string {
    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      content: "result",
    });
  }

  @Get('/status')
  async status(@Query() params: StatusDto, @Res() res){
    let flightNumber = params.flightNumber
    let query1 = await this.http.get(`http://localhost:3000/flight?flightNumber=${flightNumber}`,
      { headers: { 'Content-Type': 'application/json' } })
      .pipe(
          map(response => response.data),
      ).toPromise();

    let roomNumber = params.roomNumber
    let query2 = await this.http.get(`http://localhost:4000/room?roomNumber=${roomNumber}`,
      { headers: { 'Content-Type': 'application/json' } })
      .pipe(
          map(response => response.data),
      ).toPromise();

    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      content: {'flight details' : query1.content, 'room details' : query2.content},
    });
  }

  @Post('/booking')
  async flightBooking(@Query() params: BookingDto, @Res() res){
    let userName = params.userName
    let flightNumber = params.flightNumber
    let query1 = await this.http.post(`http://localhost:3000/booking?flightNumber=${flightNumber}&userName=${userName}`,
      { headers: { 'Content-Type': 'application/json' } })
      .pipe(
          map(response => response.data),
      ).toPromise();

      let roomNumber = params.roomNumber
      let query2 = await this.http.post(`http://localhost:4000/booking?roomNumber=${roomNumber}&userName=${userName}`,
        { headers: { 'Content-Type': 'application/json' } })
        .pipe(
            map(response => response.data),
        ).toPromise();
  
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        content: {'flight request' : query1.content, 'room request' : query2.content},
      });
  }

}
