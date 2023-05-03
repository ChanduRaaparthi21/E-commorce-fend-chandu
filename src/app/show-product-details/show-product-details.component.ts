import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { ProductService } from '../_service/product.service';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css'],
})
export class ShowProductDetailsComponent implements OnInit {
  showLoadMoreProductButton = false;
  showTable = false;
  poductDetails: Product[] = [];
  pageNumber: number = 0;

  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'description',
    'Product DiscountedPrice',
    'Product Actual Price',
    'Actions',
  ];

  constructor(
    private productService: ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }
  //this is for search the product on show product details same as home-component also
  searchByKeyword(searchkeyword) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.poductDetails = [];
    this.getAllProducts(searchkeyword);
  }
  //this is return the all products on product view details page...
  public getAllProducts(searchByKeyword: string = " ") {
    this.showTable = false;
    this.productService
      .getAllProducts(this.pageNumber, searchByKeyword)
      .pipe(
        map((x: Product[], i) =>
          x.map((product: Product) =>
            this.imageProcessingService.createImages(product)
          )
        )
      )
      .subscribe(
        (resp: Product[]) => {
          //console.log(resp);
          resp.forEach(product => this.poductDetails.push(product));
          console.log('msg',this.poductDetails);
          this.showTable = true;

          if (resp.length == 8) {
            this.showLoadMoreProductButton = true;
          } else {
            this.showLoadMoreProductButton = false;
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }
  //delete the poductid
  deleteProduct(productId) {
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        this.getAllProducts();
        this.getAllProducts();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showImages(product: Product) {
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent, {
      data: {
        images: product.productImages,
      },
      height: '500px',
      width: '800px',
    });
  }

  editProductDetails(productId) {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }

  loadMoreProducts() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }
}
