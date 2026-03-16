import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private apiService: ApiService
  ) { }

  GetServices(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Services');
  }

  GetService(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Services/' + id);
  }

  PostService(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Services', data);
  }

  PutService(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/Services/' + id, data);
  }

  DeleteService(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Services/' + id);
  }
}
