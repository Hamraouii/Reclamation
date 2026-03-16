import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private apiService: ApiService
  ) { }

  getReclamationCountByEtat(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationCountByEtat', data);
  }
  getReclamationCountByService(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationCountByService', data);
  }
  getReclamationCountByType(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationCountByType', data);
  }
  getReclamationsByDossier(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationByDossier', data);
  }
  getReclamationsWithFilter(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationwithFilter', data);
  }

  GetReclamationsByAffectedBy(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/GetReclamationsByAffectedBy/' ,data);
  }

  GetReclamationsByMACBy(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/GetReclamationsByMACBy',data);
  }

  GetReclamationsByCreatedBy(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/GetReclamationsByCreatedBy',data);
  }

  GetReclamationsByRegion(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/GetReclamationsByRegion',data);
  }

  getCountReclamation(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getCountReclamation',data);
  }

  GetReclamationCountsByTimePeriod(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/GetReclamationCountsByTimePeriod',data);
  }

  ExportReclamationList(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportListReclamation' , data);
  }

  ExportRecByType(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportRecByType' , data);
  }

  ExportRecByService(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportRecByService' , data);
  }

  ExportRecByEtat(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportRecByEtat' , data);
  }

  ExportRecByPeriode(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportRecByPeriode' , data);
  }

  ExcelReclamationList(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExcelReclamation' , data);
  }

  ExcelRecByType(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExcelRecByTypeRec' , data);
  }

  ExcelRecByService(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExcelRecByService' , data);
  }

  ExcelRecByEtat(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExcelRecByEtat' , data);
  }

  ExcelRecByPeriode(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExcelRecByPeriode' , data);
  }




}