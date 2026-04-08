import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // Handle logging, showing toasts, or redirecting based on error.status here.
      console.error('HTTP Error Details:', error);
      return throwError(() => error);
    })
  );
};
