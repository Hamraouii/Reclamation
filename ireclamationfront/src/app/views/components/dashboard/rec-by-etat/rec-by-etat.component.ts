import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/views/service/Dashboard.service';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { SourceService } from 'src/app/views/service/source.service';

@Component({
  selector: 'app-rec-by-etat',
  templateUrl: './rec-by-etat.component.html',
  styleUrls: ['./rec-by-etat.component.scss']
})
export class RecByEtatComponent {
  FormmulaireRecherche: FormGroup;
  submitted: boolean = false;
  sources: any;
  ReclamationByEtat: any[] = []; 
  isLoading: boolean = false;
  Etat_Dossiers: any;
  reclamationCount: any;


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
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getSources();


  }


  ExportRecByEtat(data : any) {
    this._loadingService.isLoading = true;

    this.dashboardService.ExportRecByEtat(data).subscribe({
      next: (event: any) => {
        console.log(event.type);
        
        if (event.type === HttpEventType.Response) {
          this.downloadFile(event);
          this._loadingService.hideLoader();
        }
      },
    });
  }

  ExcelRecByEtat(data : any) {
    this._loadingService.isLoading = true;

    this.dashboardService.ExcelRecByEtat(data).subscribe({
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

  getSources(){
    this.sourceService.GetSources().subscribe((data)=>{
      this.sources = data;
    })
  }

  getReclamationCountByetat(){
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

    this.dashboardService.getReclamationCountByEtat(this.FormmulaireRecherche.value).subscribe((data)=>{
      if (data) {
        this.ReclamationByEtat = data;
        this._loadingService.isLoading = false;
        this.dashboardService.getCountReclamation(this.FormmulaireRecherche.value).subscribe((data)=>{
          if (data) {
            this.reclamationCount = data;
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
