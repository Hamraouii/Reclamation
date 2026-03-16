import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdherentService {
  constructor(
    private apiService: ApiService
  ) { }

  GetAdherents(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Adherents');
  }

  GetTopAdherents(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Adherents/GetTopAdherents');
  }

  GetAdherentsWithFilters(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Adherents/GetAdherentsWithFilters', data);
  }

  GetAdherent(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Adherents/' + id);
  }

  GetAdherentByAffiliation(affiliation: any): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Adherents/AdherentByAffiliation?affiliation=' + affiliation);
  }

  GetRegions(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Regions');
  }

  GetVilles(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Regions/getAllVilles' );
  }

  PostAdherent(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Adherents', data);
  }

  PutAdherent(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/Adherents/' + id, data);
  }

  DeleteAdherent(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Adherents/' + id);
  }
}
