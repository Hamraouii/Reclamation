import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: 'pipe_sum',
  pure: true
})
export class pipe_sum implements PipeTransform {
  transform(liste: any[], prop: any): any {
    if (liste.length > 0 && prop) {
      return liste.reduce((a, b) => a + (b[prop] || 0), 0);
    }
    else {
      return 0;
    }
  }
}
