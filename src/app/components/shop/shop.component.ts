import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

interface Order {
  id: number;
  userId: number;
  userName: string;
  status: string;
  createdDate: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryInfo: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule ,
  ]
})
  export class ShopComponent implements OnInit {
    products: Product[] = [];
    isLoading: boolean = true;
  
   
    constructor(
      private productService: ProductService,
      private router: Router
    ) {}
   
    ngOnInit() {
      this.getProducts();
    }
    getProducts() {
      this.isLoading = true;
      this.productService.getProducts().subscribe({
        next: (response: any) => {
          this.products = response?.data?.data || [];
        },
        error: (error) => {
          console.log("Error")
          console.error('Error fetching products:', error);
          this.products = [];
          this.isLoading = false;
        },
       
      });
    }
  
    onProductClick(productId: any) {
      this.router.navigate(['/products', productId]);
    }
    
  }