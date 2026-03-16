import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoreService } from '../store.service';
import { LoadingService } from '../loading.service';

/* -------------------------------------------------------------------------- */
/*              EndPoint pour les différentes requêtes vers l'api             */
/* -------------------------------------------------------------------------- */

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    XKestrel: string = ''; // l'access token

    constructor(
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService,
        private storeService: StoreService, private loadingService: LoadingService
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

    createAuthorizationHeaderUpload() {
        this.XKestrel =
            'Bearer ' + this.storeService.get_DataSession('XKestrel');
        let headers = new HttpHeaders();
        if (this.XKestrel) {
            headers = headers.append('Authorization', this.XKestrel);
        }
        return headers;
    }

    errormessage(code: any) {
        this.loadingService.hideLoader();
        // gestion des erreurs http
        switch (code) {
            case 403: {
                localStorage.clear();
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Accès interdit ...',
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2100);
                break;
            }
            case 404: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Méthode introuvable ...',
                });
                break;
            }
            case 402: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Fichier introuvable ...',
                });
                break;
            }
            case 401: {
                localStorage.clear();
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Session expirée ...',
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 1500);
                break;
            }
            case 500:
            case 405: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Oups quelque chose a mal tourné ...',
                });
                break;
            }
            case 0: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Oups quelque chose a mal tourné ...',
                });
                break;
            }
            default: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Oups quelque chose a mal tourné ...',
                });
                break;
            }
        } // fin switch erreur
    }

    errormessageFile(code: any) {
        this.loadingService.hideLoader();
        // gestion des erreurs http
        switch (code) {
            case 403: {
                localStorage.clear();
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Accès interdit ...',
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2100);
                break;
            }
            case 404: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Fichier introuvable ...',
                });
                break;
            }
            case 402: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Fichier introuvable ...',
                });
                break;
            }
            case 401: {
                localStorage.clear();
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Session expirée ...',
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 1500);
                break;
            }
            case 500:
            case 405: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Oups quelque chose a mal tourné ...',
                });
                break;
            }
            case 0: {
                // this.messageService.add({
                //     severity: 'warn',
                //     detail: 'Oups quelque chose a mal tourné ...',
                // });
                this.messageService.add({
                    severity: 'success',
                    summary: 'succès',
                    detail: 'Téléchargé avec succès',
                    life: 3000,
                  });
                break;
            }
            default: {
                this.messageService.add({
                    severity: 'warn',
                    detail: 'Oups quelque chose a mal tourné ...',
                });
                break;
            }
        } // fin switch erreur
    }

    /* ---------------- Endpoint pour les requetes de types post ---------------- */

    post(endpoint: string, body: any) {
        return this.http.post(endpoint, body, {
            headers: this.createAuthorizationHeader(),
        }).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return throwError(() => new Error("Http error : " + erreur?.status + " " + erreur?.message));
            })
        );
    }

    postWithHeader(endpoint: string, body: any): Observable<any> {
        return this.http.post(endpoint, body, {
            headers: this.createAuthorizationHeader(),
        }).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return throwError(() => new Error("Http error : " + erreur?.status + " " + erreur?.message));
            })
        );
    }

    postSansHeader(endpoint: string, body: any) {
        return this.http.post(endpoint, body).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return of({ results: erreur });
            })
        );
    }

    postDownload(endpoint: string, body: any) {
        return this.http
            .post(endpoint, body, {
                headers: this.createAuthorizationHeader(),
                observe: 'events', // Add observe: 'events' to get progress events
                responseType: 'blob',
            })
            .pipe(
                catchError((erreur: HttpErrorResponse) => {
                    this.errormessage(erreur?.status);
                    return of({ results: erreur });
                })
            );
    }

    getDownload(endpoint: string,) {
        return this.http
            .get(endpoint, {
                headers: this.createAuthorizationHeader(),
                observe: 'events',
                responseType: 'blob'
            })
            .pipe(
                catchError((erreur: HttpErrorResponse) => {
                    this.errormessage(erreur?.status);
                    return of({ results: erreur });
                })
            );
    }

    getDownloadFile(endpoint: string,) {
        return this.http
            .get(endpoint, {
                headers: this.createAuthorizationHeader(),
                observe: 'events',
                responseType: 'blob'
            })
            .pipe(
                catchError((erreur: HttpErrorResponse) => {
                    console.log(erreur);
                    
                    this.errormessageFile(erreur?.status);
                    return of({ results: erreur });
                })
            );
    }

    postUpload(endpoint: string, body: any) {
        return this.http
            .post(endpoint, body, {
                headers: this.createAuthorizationHeaderUpload(),
            })
            .pipe(
                catchError((erreur: HttpErrorResponse) => {
                    this.errormessage(erreur?.status);
                    return of({ results: erreur });
                })
            );
    }

    get(endpoint: string) {
        return this.http
            .get(endpoint, {
                headers: this.createAuthorizationHeader(),
            })
            .pipe(
                catchError((erreur: HttpErrorResponse) => {
                    this.errormessage(erreur?.status);
                    return of({ results: erreur });
                })
            );
    }

    getSansHeader(endpoint: string) {
        return this.http.get(endpoint).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return of({ results: erreur });
            })
        );
    }

    putWithHeader(endpoint: string, body: any): Observable<any> {
        return this.http.put(endpoint, body, {
            headers: this.createAuthorizationHeader(),
        }).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return throwError(() => new Error("Http error : " + erreur?.status + " " + erreur?.message));
            })
        );
    }

    deleteWithHeader(endpoint: string): Observable<any> {
        return this.http.delete(endpoint, {
            headers: this.createAuthorizationHeader(),
        }).pipe(
            catchError((erreur: HttpErrorResponse) => {
                this.errormessage(erreur?.status);
                return throwError(() => new Error("Http error : " + erreur?.status + " " + erreur?.message));
            })
        );
    }
}
