import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './services';
import { StoreService } from './store.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    XKestrel: string = ''; // l'access token

    constructor(
        private http: HttpClient,
        private storeService: StoreService,
        private apiService: ApiService
    ) { }

    /* ----------------------- Pour créer les headers autorisation ---------------------- */
    createAuthorizationHeader() {
        this.XKestrel =
            'Bearer ' + this.storeService.get_DataSession('XKestrel');
        let headers = new HttpHeaders();
        if (this.XKestrel) {
            headers = headers.append('Authorization', this.XKestrel);
            headers = headers.append('Content-Type', 'application/json');
        }
        return headers;
    }


    
      GetUsers(): Observable<any> {
        return this.apiService.get(environment.apiUrl + '/api/Users');
      }
    
      GetRoles(): Observable<any> {
        return this.apiService.get(environment.apiUrl + '/api/Users/RolesList');
      }
    
      GetDashs(): Observable<any> {
        return this.apiService.get(environment.apiUrl + '/api/Users/DashboardList');
      }
    
      GetUser(id: number): Observable<any> {
        return this.apiService.get(environment.apiUrl + '/api/Users/' + id);
      }
    
      PostUser(data: any): Observable<any> {
        return this.apiService.post(environment.apiUrl + '/api/Users', data);
      }
    
      disactivateUser(userId:number): Observable<any> {
        return this.apiService.post(environment.apiUrl + '/api/Users/disactivateUser?id='+userId, {});
      }
    
      PutUser(id: number, data: any): Observable<any> {
        return this.apiService.putWithHeader(environment.apiUrl + '/api/Users/' + id, data);
      }
    
      resetPassword(id: number, data: any): Observable<any> {
        return this.apiService.putWithHeader(environment.apiUrl + '/api/Users/resetPassword/' + id, data);
      }
    
      addUserDashboard(data: any): Observable<any> {
        return this.apiService.postWithHeader(environment.apiUrl + '/api/UserDashboard/',data);
      }
    
      RemoveUserDashboard(userDashboardId : number): Observable<any> {
        return this.apiService.deleteWithHeader(environment.apiUrl + '/api/UserDashboard/'+userDashboardId);
      }
    
    
      DashboardByUser(id: number): Observable<any> {
        return this.apiService.get(environment.apiUrl + '/api/Users/UserDashboard/' + id);
      }
    
      DeleteUser(id: number) {
        return this.apiService.deleteWithHeader(environment.apiUrl + '/api/Users/' + id);
      }

    canActivate() {
        return this.http
            .get<boolean>(
                environment.apiUrl + '/api/Utilisateurs/CanActivate',
                {
                    headers: this.createAuthorizationHeader(),
                }
            )
            .toPromise()
            .then((res) => res)
            .then((data) => data);
    }

}
