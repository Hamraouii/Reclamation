import { Injectable } from '@angular/core';
import { ApiService } from './services';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(
    private apiService: ApiService
  ) { }

  GetReclamations(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Reclamations');
  }

  GetTopReclamations(): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Reclamations/getTopReclamations');
  }

  getReclamationsWithFilter(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations/getReclamationwithFilter', data);
  }

  GetReclamationbyId(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Reclamations/' + id);
  }

  GetReclamationHistorybyId(id: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Reclamations/ReclamationHistory/' + id);
  }

  GetReclamationbyService(ServiceId: number): Observable<any> {
    return this.apiService.get(environment.apiUrl + '/api/Reclamations/GetRecByService/' + ServiceId);
  }

  DownloadFile(FileId: number): Observable<any> {
    return this.apiService.getDownloadFile(environment.apiUrl + '/api/Reclamations/DownloadFile?fileId=' + FileId);
  }

  PostReclamations(data: any): Observable<any> {
    return this.apiService.post(environment.apiUrl + '/api/Reclamations', data);
  }

  UploadFileReclamation(reclamationId:number,formData: FormData): Observable<any> {
    return this.apiService.postUpload(environment.apiUrl + '/api/Reclamations/'+reclamationId+'/upload', formData);
  }

  PutReclamations(id: number, data: any): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/Reclamations/' + id, data);
  }

  AffectReclamations(id: number,serviceId:number): Observable<any> {
    return this.apiService.putWithHeader(environment.apiUrl + '/api/Reclamations/AffectReclamation/'+id+'?serviceId='+serviceId, {});
  }

  DeleteReclamations(id: number) {
    return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Reclamations/' + id);
  }

  
  ExportEnveloppe(data: any) {
    return this.apiService.postDownload(environment.apiUrl + '/api/Reclamations/ExportEnveloppe' , data);
  }
}
