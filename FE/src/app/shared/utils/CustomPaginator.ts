import {MatPaginatorIntl} from "@angular/material/paginator";

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Hiển thị:';
  return customPaginatorIntl;
}
