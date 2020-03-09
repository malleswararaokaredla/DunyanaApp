export class PrintDownloadOptions {
  dialogMessage: string;
  dialogHeader: string;
  enableDownloadExcel: boolean;
  enablePrint: boolean;
  dataSource: string;
  key: any;
  fileName: string;
  tableData: any;
  columns: any;
  reportHeaderColumns: any;
  reportFooterColumns: any;
}

export class LayoutOptions {
  useExternalStyles = false;
  styles: any[] = [];
  printFullHtml = false;
  returnHtmlOnClose = false;
}
