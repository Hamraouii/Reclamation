import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { ReclamationService } from 'src/app/views/service/reclamation.service';

@Component({
  selector: 'app-history-reclamation',
  templateUrl: './history-reclamation.component.html',
  styleUrls: ['./history-reclamation.component.scss']
})
export class HistoryReclamationComponent {
  take: any = 5;
  skip: any;
  order: any = 'asc';
  colone: any = 'Name';
  totalRecords: any = 0;
  reclamationHistory: any;
  ReclamationId: any;
  is_loading : boolean;
  formattedDate:any;

  constructor(
    private reclamationService: ReclamationService,
    public _loadingService: LoadingService,
    private route : ActivatedRoute,
    private datePipe: DatePipe,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {
    this.ReclamationId = this.route.snapshot.paramMap.get('reclamationId');

  }

  ngOnInit(): void {
    this.RechercherReclamations();
    this.is_loading = this._loadingService.isLoading;

  }

  RechercherReclamations() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getReclamations();
    }, 100);
  }

  formatedDate(){

  }

  getReclamations() {
    this.reclamationService.GetReclamationHistorybyId(this.ReclamationId).subscribe((data) => {
      if (data) {
        this.reclamationHistory = data?.historiqueReclamation;
        console.log(data?.historiqueReclamation);
        
        this.formattedDate = this.datePipe.transform(data?.historiqueReclamation?.dateDeffet, 'yyyy-MM-dd HH:mm:ss');


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

}
