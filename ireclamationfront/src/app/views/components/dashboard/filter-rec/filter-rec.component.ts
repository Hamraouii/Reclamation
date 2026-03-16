import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/views/service/Dashboard.service';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { SourceService } from 'src/app/views/service/source.service';
import { EtatReclamationComponent } from '../../reclamation/etat-reclamation/etat-reclamation.component';
import { EtatReclamationService } from 'src/app/views/service/etat-reclamation.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-filter-rec',
  templateUrl: './filter-rec.component.html',
  styleUrls: ['./filter-rec.component.scss']
})
export class FilterRecComponent {
  FormmulaireRecherche: FormGroup;
  submitted: boolean = false;
  sources: any;
  etatReclamation: any;
  ReclamationWithFilter: any[] = []; 
  TypeDate: any[] = []; 
  isLoading: boolean = false;
  Etat_Dossiers: any;
  selectedSources : any[] = [];


  constructor(
    public _loadingService: LoadingService,
    public dashboardService: DashboardService,
    public etatDossierServices: EtatDossierService,
    public etatReclamationService: EtatReclamationService,
    public sourceService: SourceService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.TypeDate = [
      {code : 'DCL' , name : 'Date Cloture'},
      {code : 'DR' , name : 'Date Reception'},
      {code : 'DCR' , name : 'Date Création'},
  ];

    this.FormmulaireRecherche = new FormGroup({
      TypeDate: new FormControl(null), 
      DateDebut: new FormControl(null), 
      DateEnd: new FormControl(null), 
      SourceId: new FormControl(null), 
      EtatReclamationId: new FormControl(null), 
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getSources();
    this.getEtatReclamation();

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


  getEtatReclamation(){
    this.etatReclamationService.GetEtatReclamations().subscribe((data)=>{
      this.etatReclamation = data;
    })
  }

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
    
    
    this.dashboardService.getReclamationsWithFilter(this.FormmulaireRecherche.value).subscribe((data)=>{
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
