import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_service/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Product Name', 'Customer Name',  'Contact No. / Alternate Contact No.', 'Address','User Name','Status','Action'];
  dataSource = [];
  status: string ='All';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }

  getAllOrderDetailsForAdmin(statusParameter:string){
    this.productService.getAllOrderDetailsForAdmin(statusParameter).subscribe(
      (resp)=>{
        this.dataSource= resp;
        console.log(resp);
        
      },
      (err)=>{
        console.log(err);
      }
    );
  }
  markAsDelivered(orderId){
    console.log(orderId);
    this.productService.markAsDelivered(orderId).subscribe(

      (resp)=>{
        this.getAllOrderDetailsForAdmin(this.status);
        console.log(resp);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

}
