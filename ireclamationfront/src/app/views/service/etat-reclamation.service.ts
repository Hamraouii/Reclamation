import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtatReclamationService {
  constructor(
    private apiService: ApiService
  ) { }

  GetEtatReclamations(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/EtatReclamations');
  }

  GetEtatReclamation(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/EtatReclamations/' + id);
  }

  PostEtatReclamation(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/EtatReclamations', data);
  }

  PutEtatReclamation(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/EtatReclamations' + id, data);
  }

  DeleteEtatReclamation(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/EtatReclamations/' + id);
  }
}
