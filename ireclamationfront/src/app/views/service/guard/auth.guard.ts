import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private srv: StoreService, private router: Router) { }

  canActivate(): boolean {
    if (this.srv.get_DataSession('XKestrel')) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
