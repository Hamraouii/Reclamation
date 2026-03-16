import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { SourceService } from 'src/app/views/service/source.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent {
  detailDialog: boolean;
  FormmulaireEditSource: FormGroup;
  FormmulaireAddSource: FormGroup;
  selectedSource: any;
  submitted: boolean = false;
  userId: any;
  sources: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  addSourcesDialog: boolean;
  periodiciteName: string;
  editSourcesDialog: boolean;
  EditedSource: any;
  is_delete_source: boolean;
  isRQ: boolean;
  isRA: boolean;
  Role: any;
  SmqId: any;
  ProcessId: any;
  is_loading : boolean;

  constructor(private route: ActivatedRoute,
    private sourceService: SourceService,
    public _loadingService: LoadingService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddSource = new FormGroup({
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });

    this.FormmulaireEditSource = new FormGroup({
      id: new FormControl(null, Validators.required),
      Libelle: new FormControl(null,Validators.required),
      LibelleAr: new FormControl(null,Validators.required),
    });
  }

  ngOnInit(): void {
    this.RechercherSources();
    this.is_loading = this._loadingService.isLoading;

    console.log(this.FormmulaireAddSource.controls);
    

  }

  RechercherSources() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getSources();
    }, 100);
  }

  getSources() {
    this.sourceService.GetSources().subscribe((data) => {
      if (data) {
        this.sources = data;

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


  saveSource() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireAddSource.invalid) {
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

    this.sourceService.PostSource(this.FormmulaireAddSource.value).subscribe((data: any) => {
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
          this.CloseAddSource();
          this.RechercherSources();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAddSource();
        this._loadingService.isLoading = false;
      }
    });
  }

  EditSource() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditSource.invalid) {
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
    this.sourceService.PutSource(this.FormmulaireEditSource.get("id").value, this.FormmulaireEditSource.value).subscribe((data: any) => {
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
          this.CloseEditSource();
          this.RechercherSources();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditSource();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeSource(SourceId: number) {
    this.sourceService.DeleteSource(SourceId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Source Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherSources();
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

  setEditedSource(SourceId: number) {
    this.sourceService.GetSource(SourceId).subscribe(data => {
      this.FormmulaireEditSource.get("id").setValue(SourceId)
      this.FormmulaireEditSource.get("Libelle").setValue(data?.libelle)
      this.FormmulaireEditSource.get("LibelleAr").setValue(data?.libelleAr)

      this.EditedSource = data
    })
  }

  ShowAddSource() {
    this.FormmulaireAddSource.reset();
    this.addSourcesDialog = true;
  }

  CloseAddSource() {
    this.FormmulaireAddSource.reset();
    this.addSourcesDialog = false;
  }

  ShowEditSource() {
    this.editSourcesDialog = true;
  }

  CloseEditSource() {
    this.FormmulaireEditSource.reset();
    this.editSourcesDialog = false;
  }

  get FormmulaireAddSourcesError() {
    return this.FormmulaireAddSource.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddSource.controls;
  // }

  get FormmulaireEditSourcesError() {
    return this.FormmulaireEditSource.controls
  }

  setSelectedSource(SourcesId: number) {
    this.sourceService.GetSource(SourcesId).subscribe(data => {
      this.selectedSource = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedSource = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_source = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_source = false;
    this.removeSource(this.selectedSource.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_source = false;
  }

}
