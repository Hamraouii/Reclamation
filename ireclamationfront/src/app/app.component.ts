import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { LoadingService } from './views/service/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
      private primengConfig: PrimeNGConfig,
      private router: Router,
      private loadingService: LoadingService
  ) {}

  ngOnInit() {
      this.primengConfig.ripple = true;
      this.router.events.subscribe((event ) => {
          if (event instanceof NavigationStart) {
              this.loadingService.showLoader();
          } else if (event instanceof NavigationEnd) {
              setTimeout(() => {
                  this.loadingService.hideLoader();
              }, 100);
          }
      });
  }
}
