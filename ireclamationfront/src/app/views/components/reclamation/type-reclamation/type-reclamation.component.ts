import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { TypeReclamationService } from 'src/app/views/service/type-reclamation.service';

@Component({
  selector: 'app-type-reclamation',
  templateUrl: './type-reclamation.component.html',
  styleUrls: ['./type-reclamation.component.scss']
})
export class TypeReclamationComponent {
  detailDialog: boolean;
  FormmulaireEditTypeReclamation: FormGroup;
  FormmulaireAddTypeReclamation: FormGroup;
  selectedTypeReclamation: any;
  submitted: boolean = false;
  userId: any;
  typeReclamations: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  addTypeReclamationsDialog: boolean;
  periodiciteName: string;
  editTypeReclamationsDialog: boolean;
  EditedTypeReclamation: any;
  is_delete_typeReclamation: boolean;
  isRQ: boolean;
  isRA: boolean;
  Role: any;
  SmqId: any;
  ProcessId: any;
  is_loading : boolean;

  constructor(
    private typeReclamationService: TypeReclamationService,
    public _loadingService: LoadingService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddTypeReclamation = new FormGroup({
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });

    this.FormmulaireEditTypeReclamation = new FormGroup({
      id: new FormControl(null, Validators.required),
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });
  }

  ngOnInit(): void {
    this.RechercherTypeReclamations();
    this.is_loading = this._loadingService.isLoading;
    

  }

  RechercherTypeReclamations() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getTypeReclamations();
    }, 100);
  }

  getTypeReclamations() {
    this.typeReclamationService.GetTypeReclamations().subscribe((data) => {
      if (data) {
        this.typeReclamations = data;

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


  saveTypeReclamation() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireAddTypeReclamation.invalid) {
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

    this.typeReclamationService.PostTypeReclamation(this.FormmulaireAddTypeReclamation.value).subscribe((data: any) => {
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
          this.CloseAddTypeReclamation();
          this.RechercherTypeReclamations();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAddTypeReclamation();
        this._loadingService.isLoading = false;
      }
    });
  }

  EditTypeReclamation() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditTypeReclamation.invalid) {
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
    this.typeReclamationService.PutTypeReclamation(this.FormmulaireEditTypeReclamation.get("id").value, this.FormmulaireEditTypeReclamation.value).subscribe((data: any) => {
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
          this.CloseEditTypeReclamation();
          this.RechercherTypeReclamations();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditTypeReclamation();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeTypeReclamation(TypeReclamationId: number) {
    this.typeReclamationService.DeleteTypeReclamation(TypeReclamationId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'TypeReclamation Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherTypeReclamations();
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

  setEditedTypeReclamation(TypeReclamationId: number) {
    this.typeReclamationService.GetTypeReclamation(TypeReclamationId).subscribe(data => {
      this.FormmulaireEditTypeReclamation.get("id").setValue(TypeReclamationId)
      this.FormmulaireEditTypeReclamation.get("Libelle").setValue(data?.libelle)
      this.FormmulaireEditTypeReclamation.get("LibelleAr").setValue(data?.libelleAr)

      this.EditedTypeReclamation = data
    })
  }

  ShowAddTypeReclamation() {
    this.FormmulaireAddTypeReclamation.reset();
    this.addTypeReclamationsDialog = true;
  }

  CloseAddTypeReclamation() {
    this.FormmulaireAddTypeReclamation.reset();
    this.addTypeReclamationsDialog = false;
  }

  ShowEditTypeReclamation() {
    this.editTypeReclamationsDialog = true;
  }

  CloseEditTypeReclamation() {
    this.FormmulaireEditTypeReclamation.reset();
    this.editTypeReclamationsDialog = false;
  }

  get FormmulaireAddTypeReclamationsError() {
    return this.FormmulaireAddTypeReclamation.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddTypeReclamation.controls;
  // }

  get FormmulaireEditTypeReclamationsError() {
    return this.FormmulaireEditTypeReclamation.controls
  }

  setSelectedTypeReclamation(TypeReclamationsId: number) {
    this.typeReclamationService.GetTypeReclamation(TypeReclamationsId).subscribe(data => {
      this.selectedTypeReclamation = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedTypeReclamation = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_typeReclamation = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_typeReclamation = false;
    this.removeTypeReclamation(this.selectedTypeReclamation.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_typeReclamation = false;
  }

}
