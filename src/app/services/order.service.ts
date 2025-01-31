import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpParams, 
  HttpHeaders 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDTO, OrderRequest } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { TokenService } from './token.service';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/client/order/create`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

  constructor(    private http: HttpClient,
    private tokenService: TokenService) {}

  createOrder(orderData: OrderRequest): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });   
    return this.http.post(`${environment.apiBaseUrl}/client/order/create`, orderData ,{ headers  });
  }



  getOrder(status:string,
    page: number, page_size: number
  ): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });   
    const params = new HttpParams()
      .set('page', page)      
      .set('page_size', page_size)
      .set('status', status);    
    return this.http.get(`${environment.apiBaseUrl}/client/order/listOrder` ,{headers , params });
  }
  getAllOrders(keyword:string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
      const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllOrders, { params });
  }

  getOrderDetails(orderId: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });   

    return this.http.get(`${environment.apiBaseUrl}/client/order/orderDetail/${orderId}`, {headers});
  }
  updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }
  cancelOrder(orderId: number): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });   
    return this.http.get(`${environment.apiBaseUrl}/client/order/cancelOrder/${orderId}`, {headers});
  }
  payLater(orderId: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/client/order/payLater/${orderId}`, {});
  }

  // Handle VNPay payment callback
  handleVNPayCallback(params: {
    vnp_TxnRef: string;
    vnp_Amount: string;
    // Add other potential VNPay parameters
  }): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/client/order/callback`, {
      params: {
        vnp_TxnRef: params.vnp_TxnRef,
        vnp_Amount: params.vnp_Amount
        // Include other necessary parameters
      }
    });
  }
  addRess(address: Address): Observable<OrderResponse[]> {
  
      const token = this.tokenService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });   
      return this.http.post<any>(`${environment.apiBaseUrl}/client/address/create`, address,
        { headers  });
  }
  getAddress(): Observable<any[]> {
  
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });   
    return this.http.get<any>(`${environment.apiBaseUrl}/client/address/getList`,
      { headers  });
  }
    
}