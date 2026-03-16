import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReclamationService } from '../../service/reclamation.service';
import { LoadingService } from '../../service/loading.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../../service/general/general.service';
import { ServiceService } from '../../service/service.service';
import { TypeReclamationService } from '../../service/type-reclamation.service';
import { SourceService } from '../../service/source.service';
import { AdherentService } from '../../service/adherent.service';
import { Table } from 'primeng/table';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FilesService } from '../../service/files.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss']
})
export class ReclamationComponent {
  detailDialog: boolean;
  FormmulaireEditReclamation: FormGroup;
  FormmulaireAffectReclamation: FormGroup;
  FormmulaireRecherche: FormGroup;
  selectedReclamation: any;
  submitted: boolean = false;
  reclamationId: any;
  reclamations: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  AffectReclamationDialog: boolean;
  periodiciteName: string;
  editReclamationsDialog: boolean;
  EditedReclamation: any;
  is_delete_reclamation: boolean;
  isRQ: boolean;
  isRA: boolean;
  sources: any;
  services: any;
  typeReclamations: any;
  adherents: any;
  ProcessId: any;
  is_loading : boolean;
  isAdmin:boolean;

  constructor(
    private reclamationService: ReclamationService,
    public _loadingService: LoadingService,
    public filesService: FilesService,
    public serviceService: ServiceService,
    public typeReclamationService: TypeReclamationService,
    public sourceService: SourceService,
    public adherentService: AdherentService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAffectReclamation = new FormGroup({
      id: new FormControl(null, Validators.required), 
      ServicesId: new FormControl(null, Validators.required), 
      
    });

    this.FormmulaireRecherche = new FormGroup({
      Id: new FormControl(null), 
      Reference: new FormControl(null), 
      serviceId: new FormControl(null), 
    });

    this.FormmulaireEditReclamation = new FormGroup({
      Reference: new FormControl(null, Validators.required), 
      DateReception: new FormControl(null, Validators.required), 
      UserId: new FormControl(null, Validators.required), 
      Resume: new FormControl(null, Validators.required), 
      ServicesID: new FormControl(null, Validators.required), 
      SourcesID: new FormControl(null, Validators.required), 
      TypeReclamationsID: new FormControl(null, Validators.required), 
      AdherentId: new FormControl(null, Validators.required), 
      EtatReclamationId: new FormControl(null, Validators.required), 
      Reponse: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {

    this.isAdmin = this.generaleservice.CheckIsAdmin();
    this.RechercherReclamations();
    this.is_loading = this._loadingService.isLoading;
    this.getAdherents();
    this.getServices();
    this.getSources();
    this.getTypeReclamations();
  }

  getServices(){
    this.serviceService.GetServices().subscribe((data)=>{
      this.services = data;
    })
  }

  getAdherents(){
    this.adherentService.GetAdherents().subscribe((data)=>{
      this.adherents = data;
    })
  }

  getSources(){
    this.sourceService.GetSources().subscribe((data)=>{
      this.sources = data;
    })
  }

  getTypeReclamations(){
    this.typeReclamationService.GetTypeReclamations().subscribe((data)=>{
      this.typeReclamations = data;
    })
  }

  

  ExportEnveloppe(data : any) {
    this._loadingService.isLoading = true;

    this.reclamationService.ExportEnveloppe(data).subscribe({
      next: (event: any) => {
        console.log(event.type);
        
        if (event.type === HttpEventType.Response) {
          this.downloadFile(event);
          this._loadingService.hideLoader();
        }
      },
    });
  }

  private downloadFile = (data: HttpResponse<Blob>) => {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  };

  
  getReclamationwithFilter(){
    this._loadingService.isLoading = true;
    this.submitted = true;
    
    if (this.FormmulaireRecherche.invalid) {
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
    
    
    this.reclamationService.getReclamationsWithFilter(this.FormmulaireRecherche.value).subscribe((data)=>{
      if (data) {
        this.reclamations = data;
        this._loadingService.isLoading = false;

      }
       else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this._loadingService.isLoading = false;
      }
      
    })
  }


  RechercherReclamations() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getReclamations();
    }, 100);
  }

  getReclamations() {
    this.reclamationService.GetTopReclamations().subscribe((data) => {
      if (data) {
        this.reclamations = data;

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



  affectReclamation() {
    this._loadingService.isLoading = true;
    this.submitted = true;
    

    if (this.FormmulaireAffectReclamation.invalid) {
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

    this.reclamationService.AffectReclamations(this.FormmulaireAffectReclamation.get("id").value, this.FormmulaireAffectReclamation.get("ServicesId").value).subscribe((data: any) => {
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
          this.CloseAffectReclamation();
          this.RechercherReclamations();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAffectReclamation();
        this._loadingService.isLoading = false;
      }
    });

  };

  clear(table: Table) {
    table.clear();
}

private saveFile(data: HttpResponse<Blob>, file_name: any) {
  const downloadedFile = new Blob([data.body], { type: data.body.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.download = file_name;
  a.click();
  document.body.removeChild(a);
}

DownLoadFiles(data: any) {
  this.reclamationService.DownloadFile(data?.id).subscribe({
    next: (event: any) => {
      if (event.type === HttpEventType.Response) {
        this.saveFile(event, data.fileName);
        this._loadingService.hideLoader();
      }
    },
  });
}

handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const value = target.value;
  // Now you can safely use the value property without TypeScript error
}

checkDeadline(dateCreation: Date) {
  const deadlineDate = new Date(dateCreation);
  deadlineDate.setDate(deadlineDate.getDate() + 90); // Add 90 days to the dateCreation

  const currentDate = new Date();
  
  if (currentDate > deadlineDate) {
    return true;
  } else {
    return false;
  }
}

  EditReclamation() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditReclamation.invalid) {
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
    this.reclamationService.PutReclamations(this.FormmulaireEditReclamation.get("id").value, this.FormmulaireEditReclamation.value).subscribe((data: any) => {
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
          this.CloseEditReclamation();
          this.RechercherReclamations();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditReclamation();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeReclamation(ReclamationId: number) {
    this.reclamationService.DeleteReclamations(ReclamationId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Reclamation Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherReclamations();
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

  

  setEditedReclamation(ReclamationId: number) {
    this.reclamationService.GetReclamationbyId(ReclamationId).subscribe(data => {
      this.FormmulaireEditReclamation.get("id").setValue(ReclamationId);
    this.FormmulaireEditReclamation.get("Reference").setValue(data?.reference);
    this.FormmulaireEditReclamation.get("DateReception").setValue(data?.dateReception);
    this.FormmulaireEditReclamation.get("UserId").setValue(data?.userId);
    this.FormmulaireEditReclamation.get("Resume").setValue(data?.resume);
    this.FormmulaireEditReclamation.get("ServicesID").setValue(data?.servicesID);
    this.FormmulaireEditReclamation.get("SourcesID").setValue(data?.sourcesID);
    this.FormmulaireEditReclamation.get("TypeReclamationsID").setValue(data?.typeReclamationsID);
    this.FormmulaireEditReclamation.get("AdherentId").setValue(data?.adherentId);
    this.FormmulaireEditReclamation.get("EtatReclamationId").setValue(data?.etatReclamationId);
    this.FormmulaireEditReclamation.get("Reponse").setValue(data?.reponseId);

      this.EditedReclamation = data
    })
  }

  ShowAffectReclamation(reclamationId:any) {
    this.FormmulaireAffectReclamation.reset();
    this.FormmulaireAffectReclamation.get("id").setValue(reclamationId);
    this.AffectReclamationDialog = true;
  }

  CloseAffectReclamation() {
    this.FormmulaireAffectReclamation.reset();
    this.AffectReclamationDialog = false;
  }

  ShowEditReclamation() {
    this.editReclamationsDialog = true;
  }

  CloseEditReclamation() {
    this.FormmulaireEditReclamation.reset();
    this.editReclamationsDialog = false;
  }

  get FormmulaireAffectReclamationsError() {
    return this.FormmulaireAffectReclamation.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddReclamation.controls;
  // }

  get FormmulaireEditReclamationsError() {
    return this.FormmulaireEditReclamation.controls
  }

  setSelectedReclamation(ReclamationsId: number) {
    this.reclamationService.GetReclamationbyId(ReclamationsId).subscribe(data => {
      this.selectedReclamation = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedReclamation = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cette reclamation ? ', detail: 'Confirmation' });
      this.is_delete_reclamation = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_reclamation = false;
    this.removeReclamation(this.selectedReclamation?.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_reclamation = false;
  }



}
