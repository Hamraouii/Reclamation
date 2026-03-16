import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReclamationService } from '../../../service/reclamation.service';
import { LoadingService } from '../../../service/loading.service';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../../../service/general/general.service';
import { ServiceService } from '../../../service/service.service';
import { TypeReclamationService } from '../../../service/type-reclamation.service';
import { SourceService } from '../../../service/source.service';
import { AdherentService } from '../../../service/adherent.service';
import { HttpResponse } from '@angular/common/http';
import { EtatDossierService } from 'src/app/views/service/etat-dossier.service';
import { DossierService } from 'src/app/views/service/dossier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.scss']
})
export class AddReclamationComponent {
  detailDialog: boolean;
  FormmulaireAdherent: FormGroup;
  FormmulaireAddReclamation: FormGroup;
  FormmulaireAddDossier: FormGroup;
  selectedReclamation: any;
  submitted: boolean = false;
  sources: any;
  services: any;
  listDossier : any[]= [];
  selectedFile: File;
  typeReclamations: any;
  adherents: any;
  SelectedAdherent: any;
  isLoading: boolean = false;
  is_show_add_Dossier: boolean = false;
  Etat_Dossiers: any;
  ReponseAffect: string;
  selectedSource: any;
  SourceOrgansime: number;


  constructor(
    private reclamationService: ReclamationService,
    public _loadingService: LoadingService,
    public serviceService: ServiceService,
    public etatDossierServices: EtatDossierService,
    public typeReclamationService: TypeReclamationService,
    public sourceService: SourceService,
    public adherentService: AdherentService,
    public dossierService: DossierService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddReclamation = new FormGroup({
      Reference: new FormControl(null, Validators.required), 
      ReferenceBo: new FormControl(null), 
      DateBOinp: new FormControl(null), 
      Destinataire: new FormControl(null), 
      AdresseOrg: new FormControl(null), 
      Organisme: new FormControl(null), 
      NomAdherent: new FormControl(null), 
      PrenomAdherent: new FormControl(null), 
      AdresseAdherent: new FormControl(null), 
      VilleAdherent: new FormControl(null), 
      RegionAdherent: new FormControl(null), 
      DateReception: new FormControl(null, Validators.required), 
      Resume: new FormControl(null, Validators.required), 
      ServicesId: new FormControl(null), 
      Reponse: new FormControl(null),
      SourcesId: new FormControl(null, Validators.required), 
      TypeReclamationsId: new FormControl(null, Validators.required), 
      AdherentId: new FormControl(null, Validators.required), 
      
    });

    this.FormmulaireAddDossier = new FormGroup({
      Numero_dossier: new FormControl(null), 
      Annee_dossier: new FormControl(null), 
      EtatDossierId: new FormControl(null), 
      
    });

    this.FormmulaireAdherent = new FormGroup({
      Immatriculation: new FormControl(null), 
      AdherentId: new FormControl(null), 
      Affiliation: new FormControl(null), 
      CIN: new FormControl(null), 
      Nom: new FormControl(null), 
      Prenom: new FormControl(null), 
      Region: new FormControl(null), 
      Ville: new FormControl(null),
      Adresse: new FormControl(null),
      Email: new FormControl(null),
      Tel: new FormControl(null),
      
    });



  }

  ngOnInit(): void {
    this.isLoading = this._loadingService.isLoading;
    this.getServices();
    this.getSources();
    this.getTypeReclamations();
    this.getEtatDossier();
    this.SourceOrgansime = environment.SourceOrganismeId ;


  }

  

  getEtatDossier(){
    this.etatDossierServices.GetEtatDossiers().subscribe((data:any)=>{
      this.Etat_Dossiers = data;
    })
  }

  ShowAddDossier() {
      this.is_show_add_Dossier = true;
  }

  CloseAddDossier() {
    this.FormmulaireAddDossier.reset();
    this.is_show_add_Dossier = false;
  }


  addDossier() {
    // Push form values to listDossier array
    this.listDossier.push(this.FormmulaireAddDossier.value);
    this.CloseAddDossier();
  }


  getServices(){
    this.serviceService.GetServices().subscribe((data)=>{
      this.services = data;
    })
  }

  pushDossier(){

  }

  onFileChange(event: any) {
    if (event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  

  getAdherentInfos(){
    
    if (this.SelectedAdherent) {
      this.adherentService.GetAdherentByAffiliation(this.SelectedAdherent).subscribe((data)=>{
      this.adherents = data;
    this.FormmulaireAdherent.get("Immatriculation").setValue(data?.immatriculation);
    this.FormmulaireAddReclamation.get("AdherentId").setValue(data?.id);
    this.FormmulaireAdherent.get("Affiliation").setValue(data?.affiliation);
    this.FormmulaireAdherent.get("CIN").setValue(data?.cin);
    this.FormmulaireAdherent.get("Nom").setValue(data?.nom);
    this.FormmulaireAdherent.get("Prenom").setValue(data?.prenom);
    this.FormmulaireAdherent.get("Region").setValue(data?.region?.nom);
    this.FormmulaireAdherent.get("Ville").setValue(data?.ville?.libelle);
    this.FormmulaireAdherent.get("Adresse").setValue(data?.adresse);
    this.FormmulaireAdherent.get("Email").setValue(data?.email);
    this.FormmulaireAdherent.get("Tel").setValue(data?.telephone);

    });
    }
    
  }

  saveReclamation() {
    this._loadingService.isLoading = true;
    this.submitted = true;
    
    console.log(this.FormmulaireAddReclamation.controls);
    
    if (this.FormmulaireAddReclamation.invalid) {
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


    this.reclamationService.PostReclamations(this.FormmulaireAddReclamation.value).subscribe((data: any) => {
      if (data) {
      if(this.selectedFile){
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        this.reclamationService.UploadFileReclamation(data?.id , formData).subscribe((data)=>{
          if (data != null) {
            setTimeout(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'succès',
                detail: 'File Added successfully',
                life: 3000,
              });
              
              
            }, 500);
          }
        });
      }

      if (this.listDossier.length > 0) {
        this.listDossier.forEach(dossier => {
          this.dossierService.PostDossier(data?.id , dossier).subscribe((data) => {
            if (data != null) {
              setTimeout(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'succès',
                  detail: 'Dossier Added successfully',
                  life: 3000,
                });
                
                
              }, 500);
            }
          })
        });
      }
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Reclamation ajouté avec succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.listDossier= [];
          this.FormmulaireAdherent.reset();
          this.FormmulaireAddReclamation.reset();
          
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

  get FormmulaireAddReclamationsError() {
    return this.FormmulaireAddReclamation.controls
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddReclamation.controls;
  // }


}
