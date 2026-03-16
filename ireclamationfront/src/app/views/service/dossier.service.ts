import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossierService {

  constructor(
    private apiService: ApiService
  ) { }

  GetDossierByReclamation(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Dossiers?ReclamationId=' + id);
  }
  GetDossier(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Dossiers/' + id);
  }

  PostDossier(reclamationId:number,data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Dossiers?ReclamationId='+reclamationId, data);
  }

  DeleteDossier(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Dossiers/' + id);
  }
}
