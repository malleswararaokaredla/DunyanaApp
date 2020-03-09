import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LangShareService {
  private translate = new BehaviorSubject<TranslateService>(null);

  translate$ = this.translate.asObservable();

  setTranslate(data: TranslateService) {
    this.translate.next(data);
  }
}
