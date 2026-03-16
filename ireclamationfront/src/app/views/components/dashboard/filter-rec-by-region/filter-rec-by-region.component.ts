import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/views/service/Dashboard.service';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { RegionService } from 'src/app/views/service/region.service';
import { ServiceService } from 'src/app/views/service/service.service';
import { SourceService } from 'src/app/views/service/source.service';
import { UserService } from 'src/app/views/service/user.service';

@Component({
  selector: 'app-filter-rec-by-region',
  templateUrl: './filter-rec-by-region.component.html',
  styleUrls: ['./filter-rec-by-region.component.scss']
})
export class FilterRecByRegionComponent {
  FormmulaireRecherche: FormGroup;
  submitted: boolean = false;
  regions: any;
  ReclamationWithFilter: any[] = []; 
  isLoading: boolean = false;
  Etat_Dossiers: any;


  constructor(
    public _loadingService: LoadingService,
    public dashboardService: DashboardService,
    public serviceService: ServiceService,
    public regionService: RegionService,
    public messageService: MessageService,
    private usersService: UserService,
  ) {

    

    this.FormmulaireRecherche = new FormGroup({
      DateDebut: new FormControl(null), 
      DateEnd: new FormControl(null), 
      RegionId: new FormControl(null), 
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getRegions();

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


  getRegions(){
    this.regionService.GetRegions().subscribe((data)=>{
      this.regions = data;
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
    
    this.dashboardService.GetReclamationsByRegion(this.FormmulaireRecherche.value).subscribe((data)=>{
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
