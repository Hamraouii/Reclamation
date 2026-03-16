import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService : ApiService
  ) { }

  Login(data: any) {
    return this.apiService.postSansHeader(
        environment.apiUrl + '/api/Auth/Login',
        data
    );
  }

  Register(data: any) {
    return this.apiService.postSansHeader(
        environment.apiUrl + '/api/Auth/Register',
        data
    );
}
}
