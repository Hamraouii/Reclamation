import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    private SetterSidebar = new BehaviorSubject<boolean>(null);
    GetterSideBar = this.SetterSidebar.asObservable();

    private SetterSidebar_data = new BehaviorSubject<object>(null);
    GetterSideBar_data = this.SetterSidebar_data.asObservable();

    private SetterNavs = new BehaviorSubject<object>(null);
    GetterNavs = this.SetterNavs.asObservable();

    constructor() {}

    /* -------------------------- Pusher pour l'image du sidebar ------------------------- */
    FunctionSidebar(param: boolean) {
        this.SetterSidebar.next(param);
        setTimeout(() => {
            this.SetterSidebar.next(null);
        }, 300);
    }

    /* ---------------- Pusher pour les infos user sur le sidebar --------------- */
    FunctionSidebar_data(param: object) {
        this.SetterSidebar_data.next(param);
        setTimeout(() => {
            this.SetterSidebar_data.next(null);
        }, 300);
    }

    /* --------------------------- Pusher update navs --------------------------- */
    FunctionSetterNavs(param: object) {
        this.SetterNavs.next(param);
        setTimeout(() => {
            this.SetterNavs.next(null);
        }, 300);
    }
}
