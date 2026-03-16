import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { LoadingService } from 'src/app/views/service/loading.service';
import { ReclamationService } from 'src/app/views/service/reclamation.service';

@Component({
  selector: 'app-detail-reclamation',
  templateUrl: './detail-reclamation.component.html',
  styleUrls: ['./detail-reclamation.component.scss']
})
export class DetailReclamationComponent {
  sources: any;
  services: any;
  ReclamationId: any;
  reclamation: any;
  SelectedAdherent: any; 
  isLoading: boolean;

  constructor(private route : ActivatedRoute,
    private reclamationService: ReclamationService,
    public _loadingService: LoadingService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {
    this.ReclamationId = this.route.snapshot.paramMap.get('reclamationId');

  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getReclamation();
  }

  getReclamation(){
    this.reclamationService.GetReclamationbyId(this.ReclamationId).subscribe((data) => {
      if (data) {
        this.reclamation = data;

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
