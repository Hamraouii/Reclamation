import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/views/service/Dashboard.service';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { SourceService } from 'src/app/views/service/source.service';
import { EtatReclamationService } from 'src/app/views/service/etat-reclamation.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-filter-rec-by-dossier',
  templateUrl: './filter-rec-by-dossier.component.html',
  styleUrls: ['./filter-rec-by-dossier.component.scss']
})
export class FilterRecByDossierComponent {
  FormmulaireRecherche: FormGroup;
  submitted: boolean = false;
  sources: any;
  etatDossier: any;
  ReclamationWithFilter: any[] = []; 
  isLoading: boolean = false;
  Etat_Dossiers: any;


  constructor(
    public _loadingService: LoadingService,
    public dashboardService: DashboardService,
    public etatDossierServices: EtatDossierService,
    public sourceService: SourceService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    

    this.FormmulaireRecherche = new FormGroup({
      DateDebut: new FormControl(null), 
      DateEnd: new FormControl(null), 
      SourceId: new FormControl(null), 
      EtatDossierId: new FormControl(null), 
      AnneeDossier: new FormControl(null), 
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getSources();
    this.getEtatetatDossier();

  }


  getSources(){
    this.sourceService.GetSources().subscribe((data)=>{
      this.sources = data;
    })
  }

  ExportReclamationList(data : any) {
    this._loadingService.isLoading = true;

    this.dashboardService.ExportReclamationList(data).subscribe({
      next: (event: any) => {
        console.log(event.type);
        
        if (event.type === HttpEventType.Response) {
          this.downloadFile(event);
          this._loadingService.hideLoader();
        }
      },
    });
  }

  ExcelReclamationList(data : any) {
    this._loadingService.isLoading = true;

    this.dashboardService.ExcelReclamationList(data).subscribe({
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


  getEtatetatDossier(){
    this.etatDossierServices.GetEtatDossiers().subscribe((data)=>{
      this.etatDossier = data;
    })
  }

  getReclamationByDossier(){
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
    
    this.dashboardService.getReclamationsByDossier(this.FormmulaireRecherche.value).subscribe((data)=>{
      if (data) {
        this.ReclamationWithFilter = data;
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

}
