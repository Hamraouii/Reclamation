import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/views/service/loading.service';

@Component({
  selector: 'app-loader',
  styleUrls: ['./loader.component.scss'],
  templateUrl: './loader.component.html'
})
export class loaderComponent implements OnInit {

  constructor(public loadingService:LoadingService ) {
  }
  
  ngOnInit():void {
  }
}
