import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any) {
    console.error('An error occurred:', error);
    this.snackBar.open('An error occurred. Please try again.', 'Close', {
      duration: 3000,
    });
  }
}
