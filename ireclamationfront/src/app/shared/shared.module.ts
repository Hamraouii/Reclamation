import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { PaginatorModule } from 'primeng/paginator';
import { InputMaskModule } from 'primeng/inputmask';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { TreeModule } from 'primeng/tree';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';
import { ChipsModule } from 'primeng/chips';
import { AvatarModule } from 'primeng/avatar';
import { PasswordModule } from 'primeng/password';



/* -------------------------------------------------------------------------- */
/*                          Les composants partagés                           */
/* -------------------------------------------------------------------------- */
import { loaderComponent } from './loader/loader.component';
import { pipe_get_libelle } from './pipe_get_libelle';
import { prettyjson } from './prettyjson';
import { pipe_sum } from './pipe_sum';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    declarations: [loaderComponent, pipe_get_libelle, prettyjson, pipe_sum],
    imports: [
        CheckboxModule,
        ConfirmPopupModule,
        ChartModule,
        PaginatorModule,
        TagModule,
        StepsModule,
        PasswordModule,
        MenubarModule,
        AccordionModule,
        MultiSelectModule,
        CommonModule,
        PickListModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        DialogModule,
        TabViewModule,
        CardModule,
        MessagesModule,
        DataViewModule,
        PanelModule,
        InputSwitchModule,
        DropdownModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        ButtonModule,
        FileUploadModule,
        TableModule,
        AvatarModule,
        FieldsetModule,
        BreadcrumbModule,
        InputMaskModule,
        SplitButtonModule,
        InputTextModule,
        ImageModule,
        SelectButtonModule,
        TreeModule,
        ScrollTopModule,
        ToastModule,
        RadioButtonModule,
        ListboxModule,
        ChipsModule
    ],
    exports: [
        pipe_sum,
        pipe_get_libelle,
        prettyjson,
        loaderComponent,
        ChartModule,
        PaginatorModule,
        MultiSelectModule,
        MenubarModule,
        PickListModule,
        AccordionModule,
        AvatarModule,
        FileUploadModule,
        CommonModule,
        MessagesModule,
        PasswordModule,
        ButtonModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        TooltipModule,
        DialogModule,
        TabViewModule,
        DataViewModule,
        PanelModule,
        InputSwitchModule,
        DropdownModule,
        AutoCompleteModule,
        CalendarModule,
        TableModule,
        FieldsetModule,
        BreadcrumbModule,
        StepsModule,
        InputMaskModule,
        SplitButtonModule,
        InputTextModule,
        ImageModule,
        SelectButtonModule,
        TreeModule,
        ScrollTopModule,
        CheckboxModule,
        ToastModule,
        ConfirmPopupModule,
        RadioButtonModule,
        ListboxModule,
        ChipsModule,TagModule
    ],
})
export class SharedModule { }
