import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { CrypteService } from '../crypte/crypte.service';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as CryptoJS from 'crypto-js';
import { A } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})

/* ------------------- jwt_token est le jwt token ------------------- */
export class GeneralService {
  public if_load: boolean = true;
  public is_loading: boolean = false;
  public currentMenu: any;
  public innerWidth: any = window.innerWidth; // innerWidth>=992 (web) // innerWidth<992 (mobile)
  public menu_toggel: boolean = true;
  public token: any;

  constructor(private CryprtService: CrypteService, private router: Router) { }

  /* -------------------------------------------------------------------------- */
  /*                     Fonction de l'exportation en excel                     */
  /* -------------------------------------------------------------------------- */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  showMethis() {
    // s'c'est un manager ou un administrateur
  }

  GetCurrentRole() {
    let jwt_token: any = this.get_DataSession('jwt_token');
    let id_role: any = this.DecodeJwt(jwt_token, 'id_from_base64_to_md5'); // en base64 puis md5
    return id_role;
  }

  CheckIsAdmin() {
    let roles: any = this.get_DataSession('Roles_names');
    return roles == 'admin' ? true : false;
  }

  CheckIdDashboard(id_dashboard: any) {
    let roles: any[] = this.get_DataSession('userDashboard');            
    return roles.filter(element => element?.dashboardId == id_dashboard).length > 0 ? true : false;
  }

  CheckFunction(fonction: any) {
    return (this.get_DataSession("Fonction") == fonction) ? true : false;
  }

  checkIsLogin() {
    var authUser = localStorage.getItem("user_id");
    if (authUser == null) {
      this.router.navigate(['/landing']);
    }
  }

  GotoToaccueil() {
    if (this.router.url != '/accueil') {
      this.currentMenu = '/accueil';
      this.router.navigate(['/accueil']);
    }
  }

  FileNameFormPath(filePath: string) {
    let _filepath: any[] = filePath.split("/");
    return _filepath[_filepath.length - 1];
  }

  /* --------------- Récupération d'une valeur depuis une liste --------------- */
  Get_libelle(identifiant: any = null, liste: any[] = [], prop: any = 'label') {
    if (identifiant && liste.length > 0) {
      return liste.find(
        (element: any) => Number(element?.value) == Number(identifiant)
      )?.[prop];
    } else {
      return null;
    }
  }

  ListLastDecade() {
    let dateNow = new Date();
    let year = dateNow.getFullYear();
    let list_last_decade: any[] = [];
    for (let index = 0; index < 10; index++) {
      const element = year - index;
      list_last_decade.push(element);
    }

    return list_last_decade;
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
          this.router.navigate(['/auth/login']);
        }, 100);
      } // fin if result swal
    }); // fin then swal
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  /* ------------------------- Gestion du localStorage ------------------------ */

  set_DataSession(body: any) {
    this.token = environment.KEY;
    this.token.toString(CryptoJS.enc.Base64);
    body.forEach((element) => {
      localStorage.setItem(
        element.key,
        this.CryprtService.set_crypteData(element.value, this.token).toString()
      );
      // localStorage.setItem(element.key, this.sevCrypt.set_crypteData(element.value, this.token));
    });
  }

  get_DataSession(key: any) {
    this.token = environment.KEY;
    return localStorage.getItem(key)
      ? this.CryprtService.get_decrypteData(
        localStorage.getItem(key),
        this.token
      )
      : null;
  }

  remove_DataSessionItems(kyes: any) {
    kyes.forEach((element) => {
      localStorage.removeItem(element);
    });
  }

  Get_claim(claim: any) {
    let result: any = jwt_decode(this.get_DataSession('XKestrel'));
    return result?.[claim];
  }

  /* ----------------------- Fonction pour décode le jwt ---------------------- */

  DecodeJwt(token: any, claim: any) {
    let result: any = jwt_decode(token);
    return result?.[claim];
  }

  /* -------- Récupération du sidebar suivant le rôle de l'utilisateur -------- */

  GetSidebar(token: any) { }

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

  GotoElement(id: any) {
    setTimeout(() => {
      let element: any = document.getElementById(id);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
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

  FormatDateHeureUTC(input: any) {
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

    return [year, month, day].join('-') + 'T' + hours + ':' + minutes + ':00';
    // 2000-01-01T15:44:27.454Z
  }

  GetFormatedDateNowPRIMENG() {
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

    return [year,month, day ].join('-');
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
      hours = '' + d.getUTCHours(),
      minutes = '' + d.getUTCMinutes(),
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

  changeTimeZoneToMorocco() {
    // Get the current date
    const currentDate = new Date();

    // Set the time zone offset for Morocco (UTC+1 during daylight saving time)
    const moroccoTimeZoneOffset = -60;

    // Calculate the new date and time in Morocco time zone
    const newDate = new Date(
      currentDate.getTime() + moroccoTimeZoneOffset * 60 * 1000
    );
    return newDate;
  }

  GetFormatedDateTimeNow() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      hours = '' + d.getUTCHours(),
      minutes = '' + d.getUTCMinutes(),
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

    return [day, month, year].join('/') + ' ' + hours + ':' + minutes;
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

  secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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
}
