import { BookingDto } from './dto/booking.dto';
import { StatusDto } from './dto/status.dto';
import { UserDto } from './dto/user.dto';
import { Controller, Get, Body, HttpStatus, Res, Post, Query, HttpService } from '@nestjs/common';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';
import { response } from 'express';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entity/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'util';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService
    , private readonly http: HttpService,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>) {}

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

  @Post('/create')
  async createBooking(@Query() params: UserDto, @Res() res){
    console.log(params)
    let userName = params.userName
    console.log(userName)
    let email = params.email
    let phone = params.phone
    console.log(email)
    console.log(phone )
    let cus = await this.customerRepository.create(params);
    if(cus != undefined){
      status = 'success'
    }
    else{
      status = 'failed'
    }
  
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        content: {status},
      });
  }


  @Post('/booking')
  async flightBooking(@Query() params: BookingDto, @Res() res){
    console.log(params)
    let userName = params.userName
    let flightNumber = params.flightNumber
    let seatNo = params.seat
    console.log(userName)
    console.log(flightNumber)
    console.log(seatNo)
    let query1 = await this.http.post(`http://ec2-18-219-205-234.us-east-2.compute.amazonaws.com:3000/booking?flightNumber=${flightNumber}&seat=${seatNo}&userName=${userName}`,
       { headers: { 'Content-Type': 'application/json' } })
       .pipe(
           map(response => response.data),
      ).toPromise();
    console.log(query1.content)
    let roomNumber = params.roomNumber
    let hotelName = params.hotelName
    console.log(hotelName)
    console.log(roomNumber )
    let query2 = await this.http.post(`http://ec2-13-58-119-33.us-east-2.compute.amazonaws.com:4000/booking?hotelName=${hotelName}&roomNumber=${roomNumber}&userName=${userName}`,
    { headers: { 'Content-Type': 'application/json' } })
    .pipe(
        map(response => response.data),
   ).toPromise();
      console.log(query2.content)
    let status = "booking success"
    console.log("check")
    if(query1.content === "booking failed" && query2.content === "booking success" ){
        status = "booking failed"
        let cancel1 = await this.http.post(`http://ec2-13-58-119-33.us-east-2.compute.amazonaws.com:4000/cancel-booking?hotelName=${hotelName}&roomNumber=${roomNumber}`,
       { headers: { 'Content-Type': 'application/json' } })
       .pipe(
           map(response => response.data),
      ).toPromise();
      console.log("h "+cancel1.content)    
    }
    if(query2.content === "booking failed" && query1.content === "booking success" ){
      status = "booking failed"
      let cancel2 = await this.http.post(`http://ec2-18-219-205-234.us-east-2.compute.amazonaws.com:3000/cancel-booking?flightNumber=${flightNumber}&seat=${seatNo}`,
     { headers: { 'Content-Type': 'application/json' } })
     .pipe(
         map(response => response.data),
    ).toPromise();
    console.log("f "+ cancel2.content)    
  }
  if(query1.content === "booking failed" && query2.content === "booking failed" ){
    status = "booking failed"
  }

  const updateUser = await this.customerRepository.findOne({flightNumber: params.flightNumber, seat: params.seat});
    updateUser.flightNumber = params.flightNumber;
    updateUser.seat = params.seat;
    updateUser.roomNumber = params.roomNumber;
    updateUser.hotelName = params.hotelName;
    updateUser.status = params.status;
    const result = await this.customerRepository.save(updateUser);
    let check;
    if(result  != undefined){
      check = 'cancel success'
    }
    else{
      check = 'cancel failed'
    }
  
  

      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        content: {status},
      });
  }
  

 @Post('/cancel')
  async cancelBooking(@Query() params: BookingDto, @Res() res){
    console.log(params)
    let userName = params.userName
    let flightNumber = params.flightNumber
    let seatNo = params.seat
    console.log(userName)
    console.log(flightNumber)
    console.log(seatNo)
    let query1 = await this.http.post(`http://ec2-18-219-205-234.us-east-2.compute.amazonaws.com:3000/cancel-booking?flightNumber=${flightNumber}&seat=${seatNo}`,
       { headers: { 'Content-Type': 'application/json' } })
       .pipe(
           map(response => response.data),
      ).toPromise();
    console.log(query1.content)
    let roomNumber = params.roomNumber
    let hotelName = params.hotelName
    console.log(hotelName)
    console.log(roomNumber )
    let query2 = await this.http.post(`http://ec2-18-219-205-234.us-east-2.compute.amazonaws.com:3000/cancel-booking?flightNumber=${flightNumber}&seat=${seatNo}`,
    { headers: { 'Content-Type': 'application/json' } })
    .pipe(
        map(response => response.data),
   ).toPromise();
   console.log(query2.content)

  
    status = 'booking success'

    const customer = await this.customerRepository.findOne({hotelName: params.hotelName, room: params.roomNumber,flightNumber: params.flightNumber, seat: params.seat});
    let del= await this.customerRepository.remove(customer );
    if(del != undefined){
      status = 'cancel success'
    }
    else{
      status = 'cancel failed'
    }
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        content: {status},
      });
  }

}
