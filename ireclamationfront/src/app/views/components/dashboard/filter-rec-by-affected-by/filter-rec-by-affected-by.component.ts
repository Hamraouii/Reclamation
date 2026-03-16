import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/views/service/Dashboard.service';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { ReclamationService } from 'src/app/views/service/reclamation.service';
import { ServiceService } from 'src/app/views/service/service.service';
import { ApiService } from 'src/app/views/service/services';
import { SourceService } from 'src/app/views/service/source.service';
import { UserService } from 'src/app/views/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-filter-rec-by-affected-by',
  templateUrl: './filter-rec-by-affected-by.component.html',
  styleUrls: ['./filter-rec-by-affected-by.component.scss']
})
export class FilterRecByAffectedByComponent {
  FormmulaireRecherche: FormGroup;
  submitted: boolean = false;
  sources: any;
  users: any;
  services: any;
  ReclamationWithFilter: any[] = []; 
  isLoading: boolean = false;
  Etat_Dossiers: any;


  constructor(
    public _loadingService: LoadingService,
    public dashboardService: DashboardService,
    public reclamationService: ReclamationService,
    public serviceService: ServiceService,
    public sourceService: SourceService,
    public messageService: MessageService,
    public apiService: ApiService,
    private usersService: UserService,
  ) {

    

    this.FormmulaireRecherche = new FormGroup({
      DateDebut: new FormControl(null), 
      DateEnd: new FormControl(null), 
      SourceId: new FormControl(null), 
      ServiceId: new FormControl(null), 
      UserId: new FormControl(null), 
      
    });

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getSources();
    this.getServices();
    this.getUsers();

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

  getServices(){
    this.serviceService.GetServices().subscribe((data)=>{
      this.services = data;
    })
  }

  getUsers(){
    this.usersService.GetUsers().subscribe((data)=>{
      this.users = data;
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
    console.log(this.FormmulaireRecherche.value);
    
    this.dashboardService.GetReclamationsByAffectedBy(this.FormmulaireRecherche.value).subscribe((data)=>{
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
