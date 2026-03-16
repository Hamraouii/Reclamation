import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './services';

@Injectable({
  providedIn: 'root',
})

/* ------------------- jwt_token est le jwt token ------------------- */
export class FilesService {
  constructor(
    private apiService: ApiService) { }

  /* -------------------------------------------------------------------------- */
  /*                                 XML  audit                                 */
  /* -------------------------------------------------------------------------- */
  DownloadFile(filepath: string) {
    return this.apiService.getDownloadFile(environment.apiUrl + '/api/Generale/DownloadFile?filePath=' + filepath);
  }
}
