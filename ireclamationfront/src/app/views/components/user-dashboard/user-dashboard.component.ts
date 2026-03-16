import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../service/loading.service';
import { UserService } from '../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {
  FormmulaireAddUserDashboard: FormGroup;
  submitted: boolean = false;
  UserId: any;
  isLoading: boolean = false;
  userDashboards: any[] =  []; // tableau qui stocke les dashboards de l'utilisateur connecté
  Dashboards : any[] = [];
  skip: any = 0;
  take: any = 5;
  selectedUserDashboard: any;
  is_delete_userDashboard :any;
  addUserDashboardDialog : boolean;
  is_loading : boolean;



  constructor(private route : ActivatedRoute,
    public _loadingService: LoadingService,
    public userService: UserService,
    public messageService: MessageService,
  ) {

    this.UserId = this.route.snapshot.paramMap.get('userId');

    this.FormmulaireAddUserDashboard = new FormGroup({
      userId: new FormControl(this.UserId, Validators.required),
      DashboardId : new FormControl(null, Validators.required)
      
    });

  }

  ngOnInit() {
    this.getDashboards();
    this.getDashboardListByUser();

    this.is_loading = this._loadingService.isLoading;

  }

  getDashboardListByUser(){
    this.userService.DashboardByUser(this.UserId).subscribe((res)=>{
        if (res){
          this.userDashboards = res;

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

addUserDashboard()
{
  this._loadingService.isLoading = true;
    this.submitted = true;
    
    
    if (this.FormmulaireAddUserDashboard.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Remplire formulaire !',
        life: 3000,
      });
      this._loadingService.isLoading = false;
      // this.submitted=false;
      this.CloseAddUserDashboard();
      this.getDashboardListByUser();
      return;
    }
    
    
    this.userService.addUserDashboard( this.FormmulaireAddUserDashboard.value).subscribe((data)=>{
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'dahsboard allowed for this user',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          
        }, 500);
        this.CloseAddUserDashboard();
        this.getDashboardListByUser();

      }
    });
}

ShowAddUserDashboard() {
  this.FormmulaireAddUserDashboard.reset();
  this.FormmulaireAddUserDashboard.get('userId').setValue(this.UserId);
  this.addUserDashboardDialog = true;
}

CloseAddUserDashboard() {
  this.FormmulaireAddUserDashboard.reset();
  this.addUserDashboardDialog = false;
}

removeUserDashboard(userDashboardId : number){
this.userService.RemoveUserDashboard(userDashboardId).subscribe((data) => {
  if(data){
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'succès',
        detail: 'Dashboard disallowed for this user',
        life: 3000,
      });
      this._loadingService.isLoading = false;
  });
}
});
}

getDashboards(){
  this.userService.GetDashs().subscribe((res)=>{
    if (res){
      this.Dashboards = res;

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

get FormmulaireAddUserDashboardError() {
  return this.FormmulaireAddUserDashboard.controls
}


  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedUserDashboard = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_userDashboard = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_userDashboard = false;
    this.removeUserDashboard(this.selectedUserDashboard.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_userDashboard = false;
  }

}
