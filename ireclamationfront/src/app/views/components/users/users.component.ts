import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { LoadingService } from '../../service/loading.service';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../../service/general/general.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  detailDialog: boolean;
  FormmulaireEditUser: FormGroup;
  FormmulaireAddUser: FormGroup;
  selectedUser: any;
  submitted: boolean = false;
  userId: any;
  users: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  addUsersDialog: boolean;
  periodiciteName: string;
  editUsersDialog: boolean;
  EditedUser: any;
  is_delete_user: boolean;
  isRQ: boolean;
  isRA: boolean;
  roles: any;
  services: any;
  ProcessId: any;
  is_loading : boolean;

  constructor(
    private userService: UserService,
    public _loadingService: LoadingService,
    public serviceService: ServiceService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddUser = new FormGroup({
      Nom: new FormControl(null,Validators.required),
      Prenom: new FormControl(null,Validators.required),
      Password: new FormControl(null,Validators.required),
      Email: new FormControl(null,Validators.required),
      Username: new FormControl(null,Validators.required),
      RoleId: new FormControl(null,Validators.required),
      ServiceId: new FormControl(null)
    });

    this.FormmulaireEditUser = new FormGroup({
      id: new FormControl(null, Validators.required),
      Nom: new FormControl(null,Validators.required),
      Prenom: new FormControl(null,Validators.required),
      Email: new FormControl(null,Validators.required),
      Username: new FormControl(null,Validators.required),
      RolesId: new FormControl(null,Validators.required),
      ServiceId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.RechercherUsers();
    this.is_loading = this._loadingService.isLoading;

    this.userService.GetRoles().subscribe((data)=>{
      this.roles = data;
    })

    this.serviceService.GetServices().subscribe((data)=>{
      this.services = data;
    })
    console.log(this.FormmulaireAddUser.controls);
    

  }

  RechercherUsers() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getUsers();
    }, 100);
  }

  getUsers() {
    this.userService.GetUsers().subscribe((data) => {
      if (data) {
        this.users = data;

        setTimeout(() => {
          this._loadingService.isLoading = false;
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this._loadingService.isLoading = false;
      }
    });
  }


  saveUser() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireAddUser.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Remplire formulaire !',
        life: 3000,
      });
      this._loadingService.isLoading = false;
      // this.submitted=false;
      return;
    }

    this.userId = this.generaleservice.get_DataSession("Uid");

    this.userService.PostUser(this.FormmulaireAddUser.value).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Indicateur ajouté avec succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.CloseAddUser();
          this.RechercherUsers();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAddUser();
        this._loadingService.isLoading = false;
      }
    });
  }

  EditUser() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditUser.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Remplire formulaire !',
        life: 3000,
      });
      this._loadingService.isLoading = false;
      // this.submitted=false;
      return;
    }
    this.userService.PutUser(this.FormmulaireEditUser.get("id").value, this.FormmulaireEditUser.value).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Risque Action Edité avec succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.CloseEditUser();
          this.RechercherUsers();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditUser();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeUser(UserId: number) {
    this.userService.DeleteUser(UserId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'User Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherUsers();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this._loadingService.isLoading = false;
      }
    });
  }

  disactivateUser(UserId: number) {
    this.userService.disactivateUser(UserId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'User désactivé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherUsers();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this._loadingService.isLoading = false;
      }
    });
  }

  setEditedUser(UserId: number) {
    this.userService.GetUser(UserId).subscribe(data => {
      this.FormmulaireEditUser.get("id").setValue(UserId)
      this.FormmulaireEditUser.get("Nom").setValue(data?.nom)
      this.FormmulaireEditUser.get("Prenom").setValue(data?.prenom)
      this.FormmulaireEditUser.get("Email").setValue(data?.email)
      this.FormmulaireEditUser.get("Username").setValue(data?.username)
      this.FormmulaireEditUser.get("RolesId").setValue(data?.rolesId)
      this.FormmulaireEditUser.get("ServiceId").setValue(data?.serviceId)

      this.EditedUser = data
    })
  }

  ShowAddUser() {
    this.FormmulaireAddUser.reset();
    this.addUsersDialog = true;
  }

  CloseAddUser() {
    this.FormmulaireAddUser.reset();
    this.addUsersDialog = false;
  }

  ShowEditUser() {
    this.editUsersDialog = true;
  }

  CloseEditUser() {
    this.FormmulaireEditUser.reset();
    this.editUsersDialog = false;
  }

  get FormmulaireAddUsersError() {
    return this.FormmulaireAddUser.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddUser.controls;
  // }

  get FormmulaireEditUsersError() {
    return this.FormmulaireEditUser.controls
  }

  setSelectedUser(UsersId: number) {
    this.userService.GetUser(UsersId).subscribe(data => {
      this.selectedUser = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.userId) {
      this.selectedUser = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_user = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_user = false;
    this.removeUser(this.selectedUser.userId);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_user = false;
  }

}
