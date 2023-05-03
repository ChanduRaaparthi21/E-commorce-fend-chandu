import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_service/product.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber: number = 0;

  poductDetails = [];

  showLoadButton = false;

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword){
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.poductDetails = [];
    this.getAllProducts(searchkeyword);
    }

  public getAllProducts(searchKey: string="") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe(
        (resp: Product[]) => {
          console.log(resp);
          if (resp.length == 8) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          resp.forEach(p => this.poductDetails.push(p));
          // this.poductDetails = resp;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  public loadMoreProducts() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }


}
