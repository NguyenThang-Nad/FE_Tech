import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class OrderAdminComponent implements OnInit {  
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  localStorage?: Storage;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders(this.keyword, this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.orders = response.data;
          this.totalPages = response.meta.totalPage;
          this.calculateVisiblePages();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          // Optionally show an error message to the user
        }
      });
  }

  searchOrders(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  calculateVisiblePages(): void {
    this.visiblePages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  viewDetails(order: OrderResponse): void {
    // Navigate to order details page
    this.router.navigate(['/admin/orders', order.id]);
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          // Remove the order from the list
          this.orders = this.orders.filter(order => order.id !== orderId);
          
          // Reload orders to refresh the list
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          // Optionally show an error message to the user
        }
      });
    }
  }
}