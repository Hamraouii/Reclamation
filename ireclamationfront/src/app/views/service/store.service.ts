import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { CrypteService } from './services';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public token: any;
  constructor(private sevCrypt: CrypteService, private router: Router) {}

  set_DataSession(body: any) {
    this.token = environment.KEY;
    this.token.toString(CryptoJS.enc.Base64);
    body.forEach((element : any) => {
      localStorage.setItem(
        element.key,
        this.sevCrypt.set_crypteData(element.value, this.token).toString()
      );
    });
  }

  get_DataSession(key: any) {
    this.token = environment.KEY;
    return localStorage.getItem(key)
      ? this.sevCrypt.get_decrypteData(localStorage.getItem(key), this.token)
      : null;
  }

  remove_DataSessionItems(kyes: any) {
    kyes.forEach((element :any) => {
      localStorage.removeItem(element);
    });
  }

  isLoggedIn(): boolean {
    return this.get_DataSession('XKestrel');
  }

  convertObjectToArray(data: any) {
    let result = Object.keys(data).map(function (key) {
      return [Number(key), data[key]];
    });

    return result;
  }

  Error(
    title: any,
    icon: any = 'warning',
    timer: any = 2000,
    text: any = null
  ) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: timer,
    });
  }

  GETfileType(saved_file_name: any) {
    //file type extension
    let checkFileType = saved_file_name.split('.').pop();
    let fileType: any;

    if (checkFileType == 'html') {
      fileType = 'text/html';
    }

    if (checkFileType == 'json') {
      fileType = 'application/json';
    }

    if (checkFileType == 'xml') {
      fileType = 'application/xml';
    }

    if (checkFileType == 'txt') {
      fileType = 'text/plain';
    }

    if (checkFileType == 'pdf') {
      fileType = 'application/pdf';
    }

    if (checkFileType == 'doc') {
      fileType = 'application/vnd.ms-word';
    }

    if (checkFileType == 'docx') {
      fileType = 'application/vnd.ms-word';
    }

    if (checkFileType == 'xls') {
      fileType = 'application/vnd.ms-excel';
    }

    if (checkFileType == 'xlsx') {
      fileType = 'application/vnd.ms-excel';
    }

    if (checkFileType == 'png' || checkFileType == 'PNG') {
      fileType = 'image/png';
    }

    if (checkFileType == 'jpg' || checkFileType == 'JPG') {
      fileType = 'image/jpeg';
    }

    if (checkFileType == 'jpeg' || checkFileType == 'JPEG') {
      fileType = 'image/jpeg';
    }

    if (checkFileType == 'gif') {
      fileType = 'image/gif';
    }

    if (checkFileType == 'csv') {
      fileType = 'text/csv';
    }

    return fileType;
  }

  getIcon(extension: any) {
    let icon: any;

    switch (extension) {
      case 'pdf':
        icon = 'fa fa-file-pdf-o';
        break;

      case 'doc':
        icon = 'fa fa-file-word-o';
        break;

      case 'docx':
        icon = 'fa fa-file-word-o';
        break;

      case 'xlsx':
        icon = 'fa fa-file-excel-o';
        break;

      case 'xls':
        icon = 'fa fa-file-excel-o';
        break;

      case 'txt':
        icon = 'fa fa-file';
        break;

      case 'html':
        icon = 'fa fa-code';
        break;

      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        icon = 'fa fa-file-image-o';
        break;

      default:
        icon = 'fa fa-file';
        break;
    }
    return icon;
  }

  GotoTop() {
    setTimeout(() => {
      let element: any = document.getElementById('top_bar_html');
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    }, 100);
  }

  GotoElementEnd(id: any) {
    setTimeout(() => {
      let element: any = document.getElementById(id);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    }, 100);
  }

  /* -------------------------------------------------------------------------- */
  /*       Pour l'ajout et modification et la recherche kendo date picker       */
  /* -------------------------------------------------------------------------- */
  FormatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  FormatDateHeure(input: any) {
    let date = new Date(input);
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return [year, month, day].join('-') + ' ' + hours + ':' + minutes;
  }

  GetFormatedDateNow() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return [year, month, day].join('-');
  }

  GetFormatedTimeNow() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
  }

  GetHeureMinutes(input: any) {
    let date = new Date(input);
    let d = new Date(date),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes();

    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
  }

  /* -------------------------------------------------------------------------- */
  /*                           la gestion des erreurs                           */
  /* -------------------------------------------------------------------------- */
  errorSwal(
    message: any,
    duration: any = 2000,
    icon: any = 'warning',
    text: any = '',
    showConfirmButton: any = false
  ) {
    Swal.fire({
      icon: icon,
      title: message,
      text: text,
      showConfirmButton: showConfirmButton,
      timer: duration,
    });
  }

  /* ------------------- Changer le format d'un nombre réel ------------------- */

  public numberWithCommas(number: number) {
    let test: any = number.toFixed(2);
    let parts: any = test.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }

  /* ---- Fonction pour Vérifier si un intervalle de deux dates est valide ---- */

  CheckIfDateValid(debut: any, fin: any) {
    let start = new Date(debut);
    let end = new Date(fin);
    let diff = end.valueOf() - start.valueOf();
    // la methode valueOf appliquée à une date retourne une valeur en millisecondes écoulées depuis le 1 janvier 1970 00h00
    if (diff / 3600000 > 0 || diff / 3600000 == 0) {
      // La durée converti des millisecondes en Heures
      return true;
    } // durée invalide
    else {
      return false;
    } // fin else la durée est invalide
  }

  GET_DATE_DIFF(debut: any, fin: any) {
    let start = new Date(debut);
    let end = new Date(fin);
    let diff = end.valueOf() - start.valueOf();
    return diff / 3600000 / 24 + 1; // en JOURS
  }

  destroySession() {
    Swal.fire({
      title: 'Fermeture de session',
      html: `<b>Êtes-vous sûr de vouloir fermer votre session ? </b>`,
      icon: 'info',
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#258662',
      cancelButtonColor: '#f50707',
      confirmButtonText: 'Valider',
    }).then((result: any) => {
      if (result?.value) {
        /* ------------------------ Déstruction de la session ----------------------- */
        localStorage.clear();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 100);
      } // fin if result swal
    }); // fin then swal
  }

  GetRoleId() {
    return this.get_DataSession('user_role_id');
  }
}
