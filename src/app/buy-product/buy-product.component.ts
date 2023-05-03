import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_service/product.service';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {
  isSingleProductCheckout: string = '';
  productDetails: Product[] = [];

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId:'',
    orderProductQuantityList: []
  }


  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private injector:Injector) { }

  ngOnInit(): void {

    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");
    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        { productId: x.productId, quantity: 1 }
      )
    );
    console.log(this.productDetails);
    console.log(this.orderDetails);
  }


  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();
        const ngZone = this.injector.get(NgZone);
        ngZone.run(
          ()=>{
            this.router.navigate(["/orderConfirm"]);
          }
        );
      

      },
      (err) => {
        console.log(err);
      }
    );
  }

  getQuantityForProduct(productId) {

    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity
  }

  getCaluclatedTotal(productId, productDiscountedPrice) {

    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity * productDiscountedPrice;

  }

  //qnt means quantity
  onQuantityChanged(qnt, productId) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = qnt;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productDiscountedPrice;
        grandTotal = grandTotal + price * productQuantity.quantity;
      }
    );
    return grandTotal;
  }

  createTransactionAndPlaceOrder(orderForm: NgForm) {
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (resp) => {
        console.log(resp);
        this.openTransactionModel(resp,orderForm);
      },
      (err) => {
        console.log(err);
      }

    );
  }

  openTransactionModel(response: any, orderForm:NgForm) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Chandu Raparthi',
      description: 'Payment of Shopping',
      image: 'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934__340.png',
      handler: (response: any) => {
        if(response!=null && response.razorpay_payment_id != null){
          this.processResponce(response,orderForm);
        }else{
          alert("Payment failed")
        }
       
      },
      prefill: {
        name: 'Chandu',
        email: 'chanduraparthi@gmail.com',
        contact: '7731974142'
      },
      notes: {
        address: 'Online shopiing '
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorpayobj = new Razorpay(options);
    razorpayobj.open();
  }

  processResponce(resp: any, orderForm:NgForm) {
    this.orderDetails.transactionId=resp.razorpay_payment_id;
   this.placeOrder(orderForm);
  }
}
