import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root',
})
export class IsNotAuthGuard  {
  constructor(private srv: StoreService, private router: Router) {}

  canActivate(): boolean {
    // if (!this.srv.get_DataSession("XKestrel")) {
    //   return true;
    // } else {
    //   this.router.navigate(['/app']);
    //   return false;
    // }
    return true;
  }
}
