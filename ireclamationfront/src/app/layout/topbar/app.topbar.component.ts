import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { GeneralService } from 'src/app/views/service/general/general.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    roles: any;
    fullname: any;
    FonctionOuRoles: any;
    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private generalService: GeneralService) {
        this.fullname = this.generalService.get_DataSession("NomComplet");
        this.FonctionOuRoles = this.generalService.get_DataSession("roles")
    }

    LogOut() {
        this.generalService.destroySession();
    }
}
