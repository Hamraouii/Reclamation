import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppConfigModule } from './config/config.module';
import { AppLayoutComponent } from "./app.layout.component";
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopBarComponent } from './topbar/app.topbar.component';
import { AppBreadcrumbComponent } from './breadcrumb/app.breadcrumb.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';


@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        AppBreadcrumbComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule,
        AppConfigModule,
        OverlayPanelModule, AvatarModule, ChipModule
    ],
    exports: [AppLayoutComponent, OverlayPanelModule, AvatarModule, ChipModule]
})
export class AppLayoutModule { }
