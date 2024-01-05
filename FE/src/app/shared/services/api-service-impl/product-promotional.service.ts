import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject, Observable} from "rxjs";
import {ApiProductPromotionalService} from "../api-services/api-product-promotional.service";

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionalService {
  isCloseDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly apiProductPromotionalService: ApiProductPromotionalService,
    private toastrService: ToastrService,
  ) {
  }

  getAll() {
    return this.apiProductPromotionalService.getAll();
  }

  getProductNotInPromotional() {
    return this.apiProductPromotionalService.getProductNotInPromotional();
  }

  create(data: any[]) {
    return this.apiProductPromotionalService.create(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toastrService.success('Thêm sản phẩm vào khuyến mại thành công!');
        this.isCloseDialog.next(true);
      }, error: err => {
        console.log(err);
        this.toastrService.error('Thêm sản phẩm vào khuyến mại thất bại!');
      }
    })
  }

  delete(data: any) {
    return this.apiProductPromotionalService.delete(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toastrService.success('Xoá sản phẩm khuyến mại thành công!');
        this.isCloseDialog.next(true);
      }, error: err => {
        console.log(err);
        this.toastrService.error('Xoá sản phẩm khuyến mại thất bại!');
      }
    })
  }

  getPromotional(idOder: number): Observable<any> {
    return this.apiProductPromotionalService.getPromotional(idOder);
  }

  getDiscount(idPd: number) {
    return this.apiProductPromotionalService.getDiscount(idPd);
  }
}
