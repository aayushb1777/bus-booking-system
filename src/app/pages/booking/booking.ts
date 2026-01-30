import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Master } from '../../service/master';
import jsPDF from 'jspdf';


interface Passenger {
  seatNo: number;
  name: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  Busid: number = 0;
  busdata: any;
  seatarray: any[] = [];
  bookedarray: number[] = [];
  selectedSeats: number[] = [];
  

  passengers: Passenger[] = [];
  
  constructor(private activatedRoute: ActivatedRoute, private mastersrv: Master) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.Busid = +res.id;
      this.getBusbyid();
    });
  }

  getBusbyid() {
    const result = this.mastersrv.getbusbyid(this.Busid);
    
    if (result) {
      this.busdata = result;
      this.seatarray = [];
      
      for (let i = 1; i <= this.busdata.totalSeats; i++) {
        this.seatarray.push(i);
      }
      
      this.getbookedseats();
    }
  }

  getbookedseats() {
    if (this.busdata) {
      const bookedCount = this.busdata.totalSeats - this.busdata.availableSeats;
      this.bookedarray = [];
      
      while (this.bookedarray.length < bookedCount) {
        const randomSeat = Math.floor(Math.random() * this.busdata.totalSeats) + 1;
        if (!this.bookedarray.includes(randomSeat)) {
          this.bookedarray.push(randomSeat);
        }
      }
    }
  }

  checkifseatbooked(seatNo: number): boolean {
    return this.bookedarray.includes(seatNo);
  }

  selectSeat(seatNo: number) {
    if (this.selectedSeats.includes(seatNo)) {
   
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatNo);

      this.passengers = this.passengers.filter(p => p.seatNo !== seatNo);
    } else {

      this.selectedSeats.push(seatNo);

      this.passengers.push({
        seatNo: seatNo,
        name: '',
        age: 0,
        gender: ''
      });
    }
  }

  isSelected(seatNo: number): boolean {
    return this.selectedSeats.includes(seatNo);
  }


  getPassenger(seatNo: number): Passenger | undefined {
    return this.passengers.find(p => p.seatNo === seatNo);
  }


  updatePassenger(seatNo: number, field: string, value: any) {
    const passenger = this.passengers.find(p => p.seatNo === seatNo);
    if (passenger) {
      (passenger as any)[field] = value;
    }
  }

  getTotalPrice(): number {
    return this.selectedSeats.length * (this.busdata?.price || 0);
  }

  
  bookSeats() {
   
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat!');
      return;
    }

  
    for (let passenger of this.passengers) {
      if (!passenger.name || !passenger.age || !passenger.gender) {
        alert(`Please fill all details for Seat ${passenger.seatNo}`);
        return;
      }
      if (passenger.age < 1 || passenger.age > 120) {
        alert(`Please enter valid age for Seat ${passenger.seatNo}`);
        return;
      }
    }

    
    const bookingId = 'BK' + Date.now();

   
    this.generatePDF(bookingId);


    alert(`Booking Successful!\nBooking ID: ${bookingId}\nTotal Passengers: ${this.passengers.length}`);
  }

 
  generatePDF(bookingId: string) {
    const doc = new jsPDF();

 
    doc.setFontSize(20);
    doc.text('BUS TICKET', 105, 20, { align: 'center' });

   
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Total Passengers: ${this.passengers.length}`, 20, 60);

  
    doc.setFontSize(12);
    doc.text('Bus Details:', 20, 80);
    doc.setFontSize(10);
    doc.text(`Bus Name: ${this.busdata.busName}`, 20, 90);
    doc.text(`From: ${this.busdata.fromLocation}`, 20, 100);
    doc.text(`To: ${this.busdata.toLocation}`, 20, 110);
    doc.text(`Date: ${this.busdata.travelDate}`, 20, 120);
    doc.text(`Time: ${this.busdata.departureTime}`, 20, 130);

    
    doc.setFontSize(12);
    doc.text('Passenger Details:', 20, 150);
    doc.setFontSize(10);

    let yPosition = 160; 

    
    this.passengers.forEach((passenger, index) => {
      doc.text(`Passenger ${index + 1}:`, 20, yPosition);
      yPosition += 8;
      doc.text(`  Name: ${passenger.name}`, 20, yPosition);
      yPosition += 8;
      doc.text(`  Age: ${passenger.age}`, 20, yPosition);
      yPosition += 8;
      doc.text(`  Gender: ${passenger.gender}`, 20, yPosition);
      yPosition += 8;
      doc.text(`  Seat No: ${passenger.seatNo}`, 20, yPosition);
      yPosition += 12; 
    });

    
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${this.getTotalPrice()}`, 20, yPosition + 10);

  
    doc.setFontSize(9);
    doc.text('Thank you for booking with us!', 105, yPosition + 30, { align: 'center' });

    
    doc.save(`Ticket_${bookingId}.pdf`);
  }
}