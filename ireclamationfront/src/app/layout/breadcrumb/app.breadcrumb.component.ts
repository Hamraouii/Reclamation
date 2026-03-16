import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../service/breadcrumb.service';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html',
  styleUrls: ['./app.breadcrumb.component.scss'],
})
export class AppBreadcrumbComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  items: MenuItem[] = [];

  constructor(
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
  ) {
    this.subscription = breadcrumbService.itemsHandler.subscribe((response) => {
      this.items = response;
    });
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
