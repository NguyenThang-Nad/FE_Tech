import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class ActiveAccountComponent implements OnInit {
  verifyCode: string = '';
  username: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Lấy username từ localStorage sau khi register
    const registeredUsername = localStorage.getItem('registeredUsername');
    
    console.log('Retrieved username from storage:', registeredUsername);
    
    if (registeredUsername) {
        this.username = registeredUsername;
    } else {
        // Nếu không có username trong localStorage, chuyển về trang login
        alert('Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.');
        this.router.navigate(['/register']);
    }
}
submitActiveCode() {
  console.log('Submitting with username:', this.username);
  console.log('Verify code:', this.verifyCode);

  if (!this.verifyCode) {
      alert('Vui lòng nhập mã xác thực');
      return;
  }

  this.userService.activeAccount({
      username: this.username,
      verifyCode: this.verifyCode
  }).subscribe({
      next: (response) => {
          if (response.status === 'success') {
              // Xóa thông tin đăng ký tạm thời
              localStorage.removeItem('registeredUsername');
              
              alert('Kích hoạt tài khoản thành công');
              this.router.navigate(['/login']);
          } else {
              alert(response.message || 'Kích hoạt tài khoản thất bại');
          }
      },
      error: (error) => {
          console.error('Activation error:', error);
          alert(error?.error?.message || 'Có lỗi xảy ra khi kích hoạt tài khoản');
      }
  });
}
}