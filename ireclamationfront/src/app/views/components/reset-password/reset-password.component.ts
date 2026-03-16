import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingService } from '../../service/loading.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  FormmulaireResetPass: FormGroup;
  submitted: boolean = false;
  UserId: any;
  isLoading: boolean = false;


  constructor(private route : ActivatedRoute,
    public _loadingService: LoadingService,
    public userService: UserService,
    public messageService: MessageService,
  ) {

    this.UserId = this.route.snapshot.paramMap.get('userId');


    this.FormmulaireResetPass = new FormGroup({
      Password: new FormControl(null), 
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;

  }

  resetPassword(){
    this._loadingService.isLoading = true;
    this.submitted = true;
    
    
    if (this.FormmulaireResetPass.invalid) {
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
    
    
    this.userService.resetPassword(this.UserId, this.FormmulaireResetPass.value).subscribe((data)=>{
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'password changed successfully',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          
        }, 500);
      }
    });
    
  }

}
