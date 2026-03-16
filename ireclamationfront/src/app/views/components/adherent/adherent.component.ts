import { Component } from '@angular/core';
import { AdherentService } from '../../service/adherent.service';
import { LoadingService } from '../../service/loading.service';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../../service/general/general.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adherent',
  templateUrl: './adherent.component.html',
  styleUrls: ['./adherent.component.scss']
})
export class AdherentComponent {
  detailDialog: boolean;
  FormmulaireRecherche: FormGroup;
  FormmulaireEditAdherent: FormGroup;
  FormmulaireAddAdherent: FormGroup;
  selectedAdherent: any;
  submitted: boolean = false;
  adherentId: any;
  adherents: any;
  skip: any = 0;
  take: any = 5;
  order: any = 'asc';
  colone: any = 'Name';
  regionId: number;
  regions: any;
  villes: any
  totalRecords: any = 0;
  addAdherentsDialog: boolean;
  periodiciteName: string;
  editAdherentsDialog: boolean;
  EditedAdherent: any;
  is_delete_adherent: boolean;
  roles: any;
  services: any;
  is_loading : boolean;

  constructor(
    private adherentService: AdherentService,
    public _loadingService: LoadingService,
    public messageService: MessageService,
    private generaleservice: GeneralService,
  ) {

    this.FormmulaireAddAdherent = new FormGroup({
      Affiliation: new FormControl(null), // Adjust validators as necessary
      Codeimmatriculation: new FormControl(null),
      Immatriculation: new FormControl(null),
      Cin: new FormControl(null),
      Nom: new FormControl(null, Validators.required),
      Prenom: new FormControl(null, Validators.required),
      Sexe: new FormControl(null),
      Adresse: new FormControl(null),
      VilleId: new FormControl(null),
      RegionId: new FormControl(null),
      Situationfamiliale: new FormControl(null),
      Organisme: new FormControl(null),
      Datenaissance: new FormControl(null),
      Daterecrutement: new FormControl(null),
      Dateaffiliation: new FormControl(null),
      Statutadherent: new FormControl(null),
      Pension: new FormControl(null),
      Numppr: new FormControl(null),
      Email: new FormControl(null),
      Telephone: new FormControl(null)
    });
    
    // For editing an existing adherent
    this.FormmulaireEditAdherent = new FormGroup({
      id: new FormControl(null, Validators.required), // ID of the adherent being edited
      Affiliation: new FormControl(null), // Adjust validators as necessary
      Codeimmatriculation: new FormControl(null),
      Immatriculation: new FormControl(null),
      Cin: new FormControl(null),
      Nom: new FormControl(null, Validators.required),
      Prenom: new FormControl(null, Validators.required),
      Sexe: new FormControl(null),
      Adresse: new FormControl(null),
      VilleId: new FormControl(null),
      RegionId: new FormControl(null),
      Situationfamiliale: new FormControl(null),
      Organisme: new FormControl(null),
      Datenaissance: new FormControl(null),
      Daterecrutement: new FormControl(null),
      Dateaffiliation: new FormControl(null),
      Statutadherent: new FormControl(null),
      Pension: new FormControl(null),
      Numppr: new FormControl(null),
      Email: new FormControl(null),
      Telephone: new FormControl(null)
    });

    this.FormmulaireRecherche = new FormGroup({
      Affiliation: new FormControl(null), 
      Immatriculation: new FormControl(null), 
    });
  }

  ngOnInit(): void {
    this.RechercherAdherents();
    this.is_loading = this._loadingService.isLoading;
    this.getRegions();
    this.getVilles();
  }

  getRegions(){
    this.adherentService.GetRegions().subscribe((data)=>{
      this.regions = data;
    })
  }

  getVilles(){

      this.adherentService.GetVilles().subscribe((data)=>{
        this.villes = data;
      });
    
  }

  RechercherAdherents() {
    this.skip = 0;
    this.take = 5;
    setTimeout(() => {
      this.getAdherents();
    }, 100);
  }

  getAdherentswithFilter(){
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
    
    
    this.adherentService.GetAdherentsWithFilters(this.FormmulaireRecherche.value).subscribe((data)=>{
      if (data) {
        this.adherents = data;
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

  getAdherents() {
    this.adherentService.GetTopAdherents().subscribe((data) => {
      if (data) {
        this.adherents = data;

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


  saveAdherent() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireAddAdherent.invalid) {
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

    this.adherentId = this.generaleservice.get_DataSession("Uid");

    this.adherentService.PostAdherent(this.FormmulaireAddAdherent.value).subscribe((data: any) => {
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
          this.CloseAddAdherent();
          this.RechercherAdherents();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseAddAdherent();
        this._loadingService.isLoading = false;
      }
    });
  }

  EditAdherent() {
    this._loadingService.isLoading = true;
    this.submitted = true;

    if (this.FormmulaireEditAdherent.invalid) {
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
    this.adherentService.PutAdherent(this.FormmulaireEditAdherent.get("id").value, this.FormmulaireEditAdherent.value).subscribe((data: any) => {
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
          this.CloseEditAdherent();
          this.RechercherAdherents();
        }, 500);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Oups quelque chose a mal tourné ...',
          life: 3000,
        });
        this.CloseEditAdherent();
        this._loadingService.isLoading = false;
      }
    });
  }

  removeAdherent(AdherentId: number) {
    this.adherentService.DeleteAdherent(AdherentId).subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'succès',
            detail: 'Adherent Supprimé avec Succès',
            life: 3000,
          });
          this._loadingService.isLoading = false;
          this.submitted = false;
          this.RechercherAdherents();
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

  setEditedAdherent(AdherentId: number) {
    this.adherentService.GetAdherent(AdherentId).subscribe(data => {
      this.FormmulaireEditAdherent.patchValue({
        id: AdherentId,
        Affiliation: data?.affiliation,
        Codeimmatriculation: data?.codeimmatriculation,
        Immatriculation: data?.immatriculation,
        Cin: data?.cin,
        Nom: data?.nom,
        Prenom: data?.prenom,
        Sexe: data?.sexe,
        Adresse: data?.adresse,
        VilleId: data?.villeId,
        RegionId: data?.regionId,
        Situationfamiliale: data?.situationfamiliale,
        Organisme: data?.organisme,
        Datenaissance: data?.datenaissance,
        Daterecrutement: data?.daterecrutement,
        Dateaffiliation: data?.dateaffiliation,
        Statutadherent: data?.statutadherent,
        Pension: data?.pension,
        Numppr: data?.numppr,
        Email : data?.email,
        Telephone: data?.telephone
      });

      this.EditedAdherent = data
    })
  }

  ShowAddAdherent() {
    this.FormmulaireAddAdherent.reset();
    this.addAdherentsDialog = true;
  }

  CloseAddAdherent() {
    this.FormmulaireAddAdherent.reset();
    this.addAdherentsDialog = false;
  }

  ShowEditAdherent() {
    this.editAdherentsDialog = true;
  }

  CloseEditAdherent() {
    this.FormmulaireEditAdherent.reset();
    this.editAdherentsDialog = false;
  }

  get FormmulaireAddAdherentsError() {
    return this.FormmulaireAddAdherent.controls;
  }

  // get LibelleError() { // Assuming Libelle is the name of the form control
  //   return this.FormmulaireAddAdherent.controls["Immatriculation"].errors;
  // }

  get FormmulaireEditAdherentsError() {
    return this.FormmulaireEditAdherent.controls
  }

  setSelectedAdherent(AdherentsId: number) {
    this.adherentService.GetAdherent(AdherentsId).subscribe(data => {
      this.selectedAdherent = data
    });
  }

  showDetail() {
    this.detailDialog = true;
  }

  //Show confirmation
  showConfirmDelete(data: any) {
    if (data?.id) {
      this.selectedAdherent = data;
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Êtes-vous sûr de vouloir supprimer cet Smq doc : ' + data.title + " ?", detail: 'Confirmation' });
      this.is_delete_adherent = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.is_delete_adherent = false;
    this.removeAdherent(this.selectedAdherent.id);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.is_delete_adherent = false;
  }

}
