import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RecByEtatComponent } from './rec-by-etat/rec-by-etat.component';
import { RecByTypeRecComponent } from './rec-by-type-rec/rec-by-type-rec.component';
import { RecByServiceComponent } from './rec-by-service/rec-by-service.component';
import { FilterRecComponent } from './filter-rec/filter-rec.component';
import { FilterRecByDossierComponent } from './filter-rec-by-dossier/filter-rec-by-dossier.component';
import { RecCountByTimePeriodComponent } from './rec-count-by-time-period/rec-count-by-time-period.component';
import { FilterRecByRegionComponent } from './filter-rec-by-region/filter-rec-by-region.component';
import { FilterRecByAffectedByComponent } from './filter-rec-by-affected-by/filter-rec-by-affected-by.component';
import { FilterRecByCreatedByComponent } from './filter-rec-by-created-by/filter-rec-by-created-by.component';
import { FilterRecByMACByComponent } from './filter-rec-by-macby/filter-rec-by-macby.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'recByEtat', component: RecByEtatComponent },
        { path: 'recByType', component: RecByTypeRecComponent },
        { path: 'recByService', component: RecByServiceComponent },
        { path: 'filterRec', component: FilterRecComponent },
        { path: 'recFilterByDossier', component: FilterRecByDossierComponent },
        { path: 'recByPeriod', component: RecCountByTimePeriodComponent },
        { path: 'recFilterByRegion', component: FilterRecByRegionComponent },
        { path: 'recFilterByAffectedby', component: FilterRecByAffectedByComponent },
        { path: 'recFilterByCreatedby', component: FilterRecByCreatedByComponent },
        { path: 'recFilterByMACby', component: FilterRecByMACByComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
