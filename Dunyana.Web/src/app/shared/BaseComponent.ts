import { Subject } from 'rxjs/Subject';
import { OnDestroy } from '@angular/core';

export class BaseComponent implements OnDestroy {
  destruction$ = new Subject();

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.destruction$.next();
    this.destruction$.complete();
  }
}
