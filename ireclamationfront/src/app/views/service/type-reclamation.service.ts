import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeReclamationService {

  constructor(
    private apiService: ApiService
  ) { }

  GetTypeReclamations(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/TypeReclamations');
  }

  GetTypeReclamation(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/TypeReclamations/' + id);
  }

  PostTypeReclamation(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/TypeReclamations', data);
  }

  PutTypeReclamation(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/TypeReclamations/' + id, data);
  }

  DeleteTypeReclamation(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/TypeReclamations/' + id);
  }
}
