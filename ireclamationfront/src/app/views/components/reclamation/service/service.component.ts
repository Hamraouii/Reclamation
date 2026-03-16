import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { ServiceService } from 'src/app/views/service/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  detailDialog: boolean;
  FormmulaireEditService: FormGroup;
  FormmulaireAddService: FormGroup;
  selectedService: any;
  submitted: boolean = false;
  userId: any;
  services: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  addServicesDialog: boolean;
  periodiciteName: string;
  editServicesDialog: boolean;
  EditedService: any;
  is_delete_service: boolean;
  isRQ: boolean;
  isRA: boolean;
  Role: any;
  SmqId: any;
  ProcessId: any;
  is_loading : boolean;

  constructor(
    private serviceService: ServiceService,
    public _loadingService: LoadingService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddService = new FormGroup({
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });

    this.FormmulaireEditService = new FormGroup({
      id: new FormControl(null, Validators.required),
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });
  }

  ngOnInit(): void {
    this.RechercherServices();
    this.is_loading = this._loadingService.isLoading;

    console.log(this.FormmulaireAddService.controls);
    

  }

  RechercherServices() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getServices();
    }, 100);
  }

  getServices() {
    this.serviceService.GetServices().subscribe((data) => {
      if (data) {
        this.services = data;

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


  saveService() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireAddService.invalid) {
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

    this.serviceService.PostService(this.FormmulaireAddService.value).subscribe((data: any) => {
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
          this.CloseAddService();
          this.RechercherServices();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAddService();
        this._loadingService.isLoading = false;
      }
    });
  }

  EditService() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditService.invalid) {
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
    this.serviceService.PutService(this.FormmulaireEditService.get("id").value, this.FormmulaireEditService.value).subscribe((data: any) => {
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
          this.CloseEditService();
          this.RechercherServices();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditService();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeService(ServiceId: number) {
    this.serviceService.DeleteService(ServiceId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Service Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherServices();
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

  setEditedService(ServiceId: number) {
    this.serviceService.GetService(ServiceId).subscribe(data => {
      this.FormmulaireEditService.get("id").setValue(ServiceId)
      this.FormmulaireEditService.get("Libelle").setValue(data?.libelle)
      this.FormmulaireEditService.get("LibelleAr").setValue(data?.libelleAr)

      this.EditedService = data
    })
  }

  ShowAddService() {
    this.FormmulaireAddService.reset();
    this.addServicesDialog = true;
  }

  CloseAddService() {
    this.FormmulaireAddService.reset();
    this.addServicesDialog = false;
  }

  ShowEditService() {
    this.editServicesDialog = true;
  }

  CloseEditService() {
    this.FormmulaireEditService.reset();
    this.editServicesDialog = false;
  }

  get FormmulaireAddServicesError() {
    return this.FormmulaireAddService.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddService.controls;
  // }

  get FormmulaireEditServicesError() {
    return this.FormmulaireEditService.controls
  }

  setSelectedService(ServicesId: number) {
    this.serviceService.GetService(ServicesId).subscribe(data => {
      this.selectedService = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedService = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_service = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_service = false;
    this.removeService(this.selectedService.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_service = false;
  }

}
