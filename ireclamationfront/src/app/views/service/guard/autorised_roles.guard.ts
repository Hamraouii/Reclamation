import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { StoreService } from '../services';
import { GeneralService } from '../general/general.service';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard {
  check: boolean = null;
  constructor(private router: Router, private storeService: GeneralService) { }
  // le id_from_base64_to_md5 est le id_role // crypté en base64 puis en md5

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expected_roles: any[] = route.data['roles'];
    expected_roles.forEach(element => {
      if (this.storeService.CheckIdRole(element)) {
        this.check = true;
        return;
      }
    });
    /* -------------------- Si l'utilisateur est autorisé ------------------- */
    if (this.check) {
      return true;
    } else {
      /* ----------------- Si l'utilisateur n'est pas autorisé ----------------- */
      Swal.fire({
        icon: 'error',
        title: 'Accès interdit',
        showConfirmButton: false,
        timer: 2000,
      });      
      this.router.navigate(['/app']);
      return false;
    }
  }
}
