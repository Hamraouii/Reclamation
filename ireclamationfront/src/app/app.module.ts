import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLayoutModule } from './layout/app.layout.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersComponent } from './views/components/users/users.component';
import { ResetPasswordComponent } from './views/components/reset-password/reset-password.component';
import { NotfoundComponent } from './views/components/notfound/notfound.component';
import { AdherentComponent } from './views/components/adherent/adherent.component';
import { UserDashboardComponent } from './views/components/user-dashboard/user-dashboard.component';




@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    UsersComponent,
    AdherentComponent,
    ResetPasswordComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    AppLayoutModule
  ],
  exports: [SharedModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService,
    ConfirmationService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
