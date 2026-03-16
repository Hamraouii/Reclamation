import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(
    private apiService: ApiService
  ) { }

  

  GetRegions(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Regions');
  }

  GetRegionById(regionId:number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Regions/'+regionId);
  }

}
