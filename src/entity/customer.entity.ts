import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'customer'})
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    cus_id: number;

    @Column()
    status?: string;

    @Column()
    userName?: string;

    @Column()
    email?: string;

    @Column()
    phone?: string;

    @Column()
    flightNumber: string;

    @Column()
    seat?: string;

    @Column()
    hotelName?: string;

    @Column()
    roomNumber: string;



}
