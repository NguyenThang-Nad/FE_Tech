import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService

  ) { }

  getProducts(
    keyword?: string, 
    categoryId?: number, 
    page: number = 0, 
    page_size: number = 8
  ): Observable<Product[]> {
    // Create an object to hold optional params
    const params: { [key: string]: string } = {};

    // Only add params if they are provided and not empty/zero
    if (keyword && keyword.trim() !== '') {
      params['keyword'] = keyword;
    }

    if (categoryId && categoryId !== 0) {
      params['category_id'] = categoryId.toString();
    }

    params['page'] = page.toString();
    params['page_size'] = page_size.toString();

    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, { 
      params, 
      headers 
    });
  }

  getDetailProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productId: number): Observable<Product[]> {
    const params = new HttpParams().append("id",productId);
    return this.http.get<Product[]>(`${this.apiBaseUrl}/client/product/findById`, { params });
  }
  deleteProduct(productId: number): Observable<string> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/products/${productId}`);
  }
  // updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
  //   return this.http.put<Product>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  // }  
  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    // Add a new product
    return this.http.post(`${this.apiBaseUrl}/products`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }
  deleteProductImage(id: number): Observable<any> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }
}
//update.category.admin.component.html