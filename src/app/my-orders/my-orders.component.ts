import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_service/product.service';
import { MyOrderDetails } from '../_model/order.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  displayedColumns =["Product","Name", "Address", "Contact Number","Alternate Contact Number", "Amount", "Status"];

  MyOrderDetails : MyOrderDetails[] = [];

  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.getOrderDetils();
  }

  getOrderDetils(){
    this.productService.getMyOrders().subscribe(
      (resp: MyOrderDetails[])=>{
     console.log(resp);
     this.MyOrderDetails = resp;
     },
     (err)=>{
      console.log(err);
     }
    );
  }

}
