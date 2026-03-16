import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(
    private apiService: ApiService
  ) { }

  GetSources(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Sources');
  }

  GetSource(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Sources/' + id);
  }

  PostSource(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Sources', data);
  }

  PutSource(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/Sources/' + id, data);
  }

  DeleteSource(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Sources/' + id);
  }
}
