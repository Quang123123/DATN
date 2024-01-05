import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Constants} from "../../../shared/Constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {OriginFormComponent} from "../origin-form/origin-form.component";
import {OriginService} from "../../../shared/services/api-service-impl/origin.service";
import {ConfirmDialogComponent} from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-battery-power-list',
  templateUrl: './origin-list.component.html',
  styleUrls: ['./origin-list.component.scss']
})
export class OriginListComponent implements OnInit {

  isLoading = true;
  readonly TYPE_DIALOG = Constants.TYPE_DIALOG;
  readonly RESULT_CLOSE_DIALOG = Constants.RESULT_CLOSE_DIALOG;
  title: string;
  message: string;
  status : boolean ;

  ngOnInit(): void {
    this.getAll();
  }

  displayedColumns: string[] = ['index', 'name', 'status', 'thaoTac'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder,
              private dialogService: MatDialog,
              private readonly apiOrigin: OriginService,
              private originService: OriginService,
              private matDialog: MatDialog,
  ) {
  }

  getAll() {
    this.originService.getAll().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDiaLog(type: string, row?: any) {
    this.dialogService.open(OriginFormComponent,
      {
        width: "600px",
        disableClose: true,
        hasBackdrop: true,
        data: {type, row}
      }).afterClosed().subscribe(result => {
      if (result === Constants.RESULT_CLOSE_DIALOG.SUCCESS) {
        this.getAll();
      }
      ;
    });
  }

  active( type:string , row: any) {
    if (type == this.RESULT_CLOSE_DIALOG.ACTIVE) {
      this.title = 'Kích hoạt xuất xứ!';
      this.message = 'Bạn có chắc chắn muốn kích hoạt xuất xứ này?'
      this.status = true;
    } else {
      this.title = 'Vô hiệu hoá xuất xứ!';
      this.message = 'Bạn có chắc chắn muốn vô hiệu hoá xuất xứ này?'
      this.status = false ;
    }

    const diaLogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        message: this.message,
        title: this.message
      }
    });
    diaLogRef.afterClosed().subscribe(rs => {
        if (rs == Constants.RESULT_CLOSE_DIALOG.CONFIRM) {
          row.status = this.status ;
          this.apiOrigin.update(row.id, row);
        }
      }
    )
  }
}
