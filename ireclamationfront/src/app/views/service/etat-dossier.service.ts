import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './services';

@Injectable({
  providedIn: 'root'
})
export class EtatDossierService {

  constructor(
    private apiService: ApiService
  ) { }

  GetEtatDossiers(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/EtatDossier');
  }

  GetEtatDossier(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/EtatDossier/' + id);
  }

  PostEtatDossier(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/EtatDossier', data);
  }

  PutEtatDossier(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/EtatDossier' + id, data);
  }

  DeleteEtatDossier(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/EtatDossier/' + id);
  }
}
