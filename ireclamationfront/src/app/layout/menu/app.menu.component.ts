import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { GeneralService } from 'src/app/views/service/general/general.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/views/service/user.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    Dashboards: any[] = [];
    itemsDash: any[] = [];
    currentUser : any;
    isAdmin : boolean;

    constructor(public layoutService: LayoutService,
        private UserService : UserService,
        private generalService: GeneralService) { }

    ngOnInit() {
        this.UserService.GetDashs().subscribe((res)=>{
            
            if (res) {

                this.Dashboards = res;
                this.Dashboards.forEach((item) => {                    
                    this.generalService.CheckIdDashboard(item?.id) && this.itemsDash.push({ label: item?.displayName, icon: 'pi pi-fw pi-home', routerLink: ['/app/'+item?.name] })
        
                });  
                
            }
      });
       
        this.currentUser = this.generalService.get_DataSession('Roles_names');
        this.isAdmin = this.generalService.CheckIsAdmin();


           
        
       
        

        // this.generalService.CheckIdDashboard(1) && itemsDash.push({ label: 'Reclamation par Etat', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByEtat'] })

        if (this.isAdmin){

        
        
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app'] },
                        { label: 'Reclamation par Etat', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByEtat'] },
                        { label: 'Reclamation par Type', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByType'] },
                        { label: 'Reclamation par Service', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByService'] },
                        { label: 'Reclamation par Periode', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByPeriod'] },
                        { label: 'Reclamation Avec Filter', icon: 'pi pi-fw pi-home', routerLink: ['/app/filterRec'] },
                        { label: 'Reclamation Filtrer par Dossier', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByDossier'] },
                        { label: 'Reclamation Filtrer par Region', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByRegion'] },
                        { label: 'Etat des Affectées', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByAffectedby'] },
                        { label: 'Etat des Reclamation MAC', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByMACby'] },
                        { label: 'Etat des instances', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByCreatedby'] },
                    ]
                },
                {
                    label: 'Reclamation',
                    items: [
                        { label: 'Liste des Reclamations', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation'] },
                        { label: 'Ajouter une Reclamation', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/addReclamation'] },
                    ]
                },
                {
                    label: 'Admin',
                    items: [
                        { label: 'Source de réclamation', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/sources'] },
                        { label: 'Type de réclamation', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/TypeReclamation'] },
                        { label: 'Services ', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/services'] },
                        { label: 'Utilisateurs', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/users'] },
                        { label: 'Adherents', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/adherents'] },
                    ]
                },
                
            ];
        }else if (!this.isAdmin){
            this.model = [
                {
                    label: 'Home',
                    items: this.itemsDash
                    // items: [
                    //     { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app'] },
                    //     { label: 'Reclamation par Etat', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByEtat'] },
                    //     { label: 'Reclamation par Type', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByType'] },
                    //     { label: 'Reclamation par Service', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByService'] },
                    //     { label: 'Reclamation par Periode', icon: 'pi pi-fw pi-home', routerLink: ['/app/recByPeriod'] },
                    //     { label: 'Reclamation Avec Filter', icon: 'pi pi-fw pi-home', routerLink: ['/app/filterRec'] },
                    //     { label: 'Reclamation Filtrer par Dossier', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByDossier'] },
                    //     { label: 'Reclamation Filtrer par Region', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByRegion'] },
                    //     { label: 'Etat des Affectées', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByAffectedby'] },
                    //     { label: 'Etat des Reclamation MAC', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByMACby'] },
                    //     { label: 'Etat des instances', icon: 'pi pi-fw pi-home', routerLink: ['/app/recFilterByCreatedby'] },
                    // ]
                },
                {
                    label: 'Reclamation',
                    items: [
                        { label: 'Liste des Reclamations', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation'] },
                        { label: 'Ajouter une Reclamation', icon: 'pi pi-fw pi-home', routerLink: ['/app/Reclamation/addReclamation'] },
                    ]
                },
               
                
            ];
        }

        
        // else {
        //     this.generalService.destroySession();
        // }
    }

    getDashboards(){
        
      }
}
