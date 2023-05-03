import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_service/product.service';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css'],
})
export class ShowProductDetailsComponent implements OnInit {
  poductDetails: Product[] = [];

  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'Product Description',
    'Product DiscountedPrice',
    'Product Actual Price',
    'Images',
    'Edit',
    'Delete',
  ];

  constructor(
    private productService: ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts()
    .pipe(
      map((x:Product[], i )=> x.map((product: Product)=>this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        console.log(resp);
        this.poductDetails = resp;
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
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showImages(product: Product) {
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent,{
      data:{

        images: product.productImages
      },
      height:'500px',
      width:'800px'
    });
  }

}
