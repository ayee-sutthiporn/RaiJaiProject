import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `ข้อผิดพลาด: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 401:
                        errorMessage = 'กรุณาเข้าสู่ระบบอีกครั้ง';
                        router.navigate(['/']);
                        break;
                    case 403:
                        errorMessage = 'คุณไม่มีสิทธิ์เข้าถึง';
                        break;
                    case 404:
                        errorMessage = 'ไม่พบข้อมูลที่ต้องการ';
                        break;
                    case 500:
                        errorMessage = 'เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง';
                        break;
                    default:
                        errorMessage = error.error?.message || errorMessage;
                }
            }

            console.error('HTTP Error:', error);
            // You can show a toast/notification here using NotificationService if needed

            return throwError(() => new Error(errorMessage));
        })
    );
};
