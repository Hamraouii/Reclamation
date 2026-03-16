import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { UserService } from 'src/app/views/service/services';
import { LoadingService } from 'src/app/views/service/loading.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/views/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    /* ---------------------------- Autres variables ---------------------------- */
    Login: Subscription ;
    FormulaireLogin: FormGroup;
    /* ----------------------- les variables des messages ----------------------- */
    IsFiled: boolean = false;
    IsMultiplRole: boolean = false;
    Selected_role: number = 0;
    list_roles: any[] = [];
    Data_login: any;

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private generalService: GeneralService,
        public _LoadingService: LoadingService,
        private router: Router
    ) {
        this.generalService.if_load = false; // suppression du loader
        /* ------------------ Initialisation du formulaire de login ----------------- */
        this.FormulaireLogin = new FormGroup({
            Username: new FormControl(null, [
                Validators.minLength(3),
                Validators.maxLength(100),
                Validators.required,
            ]),
            Password: new FormControl(null, [
                Validators.minLength(3),
                Validators.maxLength(30),
                Validators.required,
            ]),
        });
    }

    ngOnInit(): void {
    }

    /* -------------------------------------------------------------------------- */
    /*                         Les fonctions pour le login                        */
    /* -------------------------------------------------------------------------- */

    get loginErrors() {
        return this.FormulaireLogin.controls;
    }

    LoginUtilisateur() {
        this.IsFiled = true;
        if (this.FormulaireLogin.valid) {
            // Si le formulaire est valide
            this._LoadingService.isLoading = true;
            this.Login = this.authService
                .Login({
                    Username: this.FormulaireLogin.value.Username, // removing spaces
                    Password: this.FormulaireLogin.value.Password,
                })
                .subscribe({
                    next: (r: any) => {
                        if (r?.msg) {
                            switch (r?.msg) {
                                case 'non_existant': {
                                    this.error('Compte non existant');
                                    break;
                                }
                                case 'deleted': {
                                    this.error(
                                        'Compte supprimé, veuillez contacter le support merci'
                                    );
                                    break;
                                }
                                case 'Authentifié': {
                                    this.messageService.add({
                                        severity: 'success',
                                        detail: 'Authentification valide',
                                    });
                                    setTimeout(() => {
                                        this.Data_login = r?.['data'];
                                        this.Data_login.forEach((element) => {
                                            if (element.key == 'roles') {
                                                this.list_roles = element.value;
                                                this.Selected_role =
                                                    element.value?.[0];
                                                this.StoreData(
                                                    this.Data_login
                                                );
                                            }
                                        });
                                    }, 100);
                                    break;
                                }
                                case 'mot_de_passe_invalide': {
                                    this.error('Mot de passe incorrect');
                                    break;
                                }
                                case 'non_autoriser': {
                                    this.error(
                                        'Utilisateur non autorisé, veuillez contacter le support merci'
                                    );
                                    break;
                                }
                                case 'empty_password': {
                                    this.error(
                                        'Vous avez un mot de passe vide, veuillez contacter le support merci'
                                    );
                                    break;
                                }
                                case 'erreur_de_parametres': {
                                    this.error('Erreur de paramètres !');
                                    break;
                                }
                                case 'erreur_jwt': {
                                    this.error(
                                        'Erreur de de géneration du ticket JWT !'
                                    );
                                    break;
                                }
                                case 'erreur': {
                                    this.error(
                                        'Oups quelque chose a mal tourné au niveau du serveur !'
                                    );
                                    break;
                                }
                                case 'erreur_database': {
                                    this.error(
                                        'Erreur lié à la base de données !'
                                    );
                                    break;
                                }
                                default:
                                    this.error(
                                        'Oups quelque chose a mal tourné'
                                    );
                                    break;
                            } // fin switch
                        } else {
                            this.error('Oups quelque chose a mal tourné');
                        }
                    },
                    error: () => {
                        this._LoadingService.isLoading = false;
                    },
                    complete: () => {
                        this._LoadingService.isLoading = false;
                    },
                });
                    
        } // Si le formulaire est invalide
        else {
            this.error('Veuillez saisir les informations qui manquent !');
        }
    }

    StoreData(data: any) {
        let body: any[] = [];
            data.forEach((element) => {
                let _body = {
                    key: element?.key,
                    value: element?.value,
                };
                body.push(_body);
            });

            //Current role
            let role_body = {
                key: 'current_role',
                value: this.Selected_role,
            };
            body.push(role_body);

            setTimeout(() => {
                this.generalService.set_DataSession(body);
                setTimeout(() => {
                    this.router.navigate(['/app']);
                }, 100);
            }, 100);
    }

    SelectRole(role: any) {
        this.Selected_role = role;
        this.StoreData(this.Data_login);
    }

    /* -------------------------------------------------------------------------- */
    /*                            Les autres fonctions                            */
    /* -------------------------------------------------------------------------- */

    error(message: any) {
        this.messageService.add({ severity: 'error', detail: message });

        this._LoadingService.isLoading = false;
    }

    ngOnDestroy(): void {
        let unsubscribe: any[] = [this.Login];
        unsubscribe.forEach((element: any) => {
            if (element) {
                element.unsubscribe();
            }
        });
    }
}
