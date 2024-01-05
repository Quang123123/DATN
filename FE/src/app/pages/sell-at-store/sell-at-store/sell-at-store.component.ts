import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProductDetailsService} from '../../../shared/services/api-service-impl/product-details.service';
import {StorageService} from '../../../shared/services/jwt/storage.service';
import {OrderService} from '../../../shared/services/api-service-impl/order.service';
import {OrderDetailService} from '../../../shared/services/api-service-impl/orderDetail.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/confirm-dialog/confirm-dialog.component';
import {Constants} from '../../../shared/Constants';
import {CustomerFormComponent} from '../../customer-management/customer-form/customer-form.component';
import {CustomerService} from '../../../shared/services/api-service-impl/customer.service';
import {ToastrService} from 'ngx-toastr';
import {ProductPromotionalService} from "../../../shared/services/api-service-impl/product-promotional.service";
import {Router} from "@angular/router";
import {ScannerFormComponent} from "../scanner-form/scanner-form.component";
import {BehaviorSubject, debounceTime} from "rxjs";
import {AuthService} from "../../../shared/services/jwt/auth.service";
import {ChangeInfoLoginComponent} from "../../change-info-login/change-info-login.component";
import {OrderSellComponent} from "../order-sell/order-sell.component";

@Component({
  selector: 'app-sell-at-store',
  templateUrl: './sell-at-store.component.html',
  styleUrls: ['./sell-at-store.component.scss']
})
export class SellAtStoreComponent implements OnInit {
  isLoading = true;
  public isCollapsed = true;
  RESULT_CLOSE_DIALOG = Constants.RESULT_CLOSE_DIALOG;
  TYPE_DIALOG = Constants.TYPE_DIALOG;
  TYPE_UPDATE_NUMBER_PRD = Constants.TYPE_UPDATE_NUMBER_PRD;
  PLUS_PRODUCT = Constants.TYPE_UPDATE_NUMBER_PRD.PLUS

  tabs = [];
  selected = new FormControl(0);

  dataSearch: any[] = [];
  keyword = 'name';
  keySearch = new FormControl('');
  changeSearch: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ordersOfStaff: any[] = [];
  name = '';
  products: any[] = [];
  promotions: any;
  findByIdOrder: any[] = []
  orders: any[] = [];
  orderDetails: any[] = [];
  carts: any[] = [];
  addProduct: any;
  filterProduct: any;
  dataOrder: any;
  dataOrderDetail: any;
  checkQuantity = false;
  createOrder: any;
  idOrder: any;
  idHoaDon: any[] = [];
  price: number;
  countQuantity: number = 0;
  listImei: any[] = [];

  tongTienHang: number = 0
  giamGia: number = 0;
  tienKhachCanTra: number = 0
  tienKhachDua: number = 0;
  tienThuaTraKhach: number = 0;

  formGroup: FormGroup;
  formGroupCustomer: FormGroup = this.fb.group({
    customer: this.fb.group({
      id: 167
    }),
    description: ''
  })

  formMoney: FormGroup = this.fb.group({
    tienKhachDua: ''
  })
  full_name: string;

  listCustomer: any[] = [];
  datetime = new Date();

  constructor(private productDetailService: ProductDetailsService,
              private customerService: CustomerService,
              private promotionDetailService: ProductPromotionalService,
              private fb: FormBuilder,
              private orderService: OrderService,
              private orderDetailService: OrderDetailService,
              private matDiaLog: MatDialog,
              private toastService: ToastrService,
              private storageService: StorageService,
              private router: Router,
              private authService: AuthService) {
    this.full_name = this.storageService.getFullNameFromToken();
  }

  ngOnInit(): void {
    this.setDataOrder();
    this.getAllNameProduct();
    this.getCustomerForCombobox();
    this.getOrderByStaff(this.storageService.getIdFromToken());
    this.getListOrderOfStaff();
    this.getListImei();
  }

  getListOrderOfStaff() {
    this.orderService.getListOrder(this.storageService.getIdFromToken()).subscribe((data: any) => {
      this.ordersOfStaff = data;
      for (let i = 0; i < data.length; i++) {
        console.log('id order của staff: ', data[i].id)
        this.tabs.length = this.ordersOfStaff.length;
        this.idHoaDon.push({
          name: (this.tabs.length - 1) + 1,
          value: data[i].id
        })
      }
    })
    console.log('value: ', this.idHoaDon)
  }

  getListImei() {
    this.productDetailService.getAllProductDetail().subscribe((data: any) => {
      this.listImei = data;
    })
  }

  onSubmitSearch() {
    try {
      if (this.keySearch.value?.trim().length == 0 || this.keySearch.value == null) {
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
    this.keySearch.reset();
  }

  onChangeSearch($event: any) {
    this.changeSearch.next($event);
    this.changeSearch.pipe(debounceTime(1000)).subscribe(value => {
      if (value !== '') {
        this.productDetailService.findProductByName(value).subscribe(data => {
          this.dataSearch = data
        });
        this.changeSearch.next('');
      }
    })
  }

  openSave(type: any, row?: any) {
    const dialogRef = this.matDiaLog.open(CustomerFormComponent, {
      width: '780px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        type, row
      }
    });
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == Constants.RESULT_CLOSE_DIALOG.SUCCESS) {
        this.getCustomerForCombobox();
      }
    })
  }

  getCustomerForCombobox() {
    this.customerService.getAll().subscribe((data: any) => {
      if (data) {
        this.listCustomer = data;
      }
    });
  }

  getDiscount(idPd: number) {
    this.promotionDetailService.getDiscount(idPd).subscribe((rs: any) => {
      this.promotions = rs;
    })
  }

  selectEvent($event: any) {
    this.addOrder($event.id);
    this.keySearch.reset();
  }

  getAllNameProduct() {
    this.productDetailService.getAllProductDetail().subscribe((data: any) => {
      this.products = data;
      this.filterProduct = data;
    })
  }

  addTab(selectAfterAdding: boolean) {
    const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Tạo hóa đơn',
        message: 'Bạn có muốn tạo hóa đơn không ?',
      }
    });
    diaLogRef.afterClosed().subscribe((data: any) => {
      const createOrder = {
        customer: {
          id: this.formGroupCustomer.getRawValue().customer.id
        },
        staff: {
          id: this.storageService.getIdFromToken()
        },
        shipAddress: 'Tai quay',
        createDate: new Date(),
        paymentType: 0,
        status: 0,
        total: this.tongTienHang,
        discount: this.giamGia,
        totalPayment: this.tienKhachCanTra,
        feeShipping: 0,
        type: 1,
        description: ''
      }

      if (data == this.RESULT_CLOSE_DIALOG.CONFIRM) {
        this.orderService.save(createOrder).subscribe((data: any) => {
          if (this.tabs.length < 10) {
            this.tabs.push(this.tabs[this.tabs.length - 1] + 1);
            this.selected.setValue(this.tabs.length - 1);
            console.log('tabs: ', this.tabs.length);
            this.toastService.success('Tạo hóa đơn thành công !');
            this.getOrderByStaff(this.storageService.getIdFromToken());
            this.defaultPayment();
            this.idOrder = data.id;
            console.log(this.idOrder)

            this.idHoaDon.push({
              name: (this.tabs.length - 1) + 1,
              value: data.id
            })
            this.orderDetailService.findOrderDetailByOrder(this.idOrder).subscribe((data2: any) => {
              this.orderDetails = data2;
            })
          }

        }, error => {
          this.toastService.error('Tạo hóa đơn thất bại !')
          console.log(error)
          return;
        })
      }
    })
  }

  defaultPayment() {
    this.giamGia = 0;
    this.tongTienHang = 0;
    this.tienKhachCanTra = 0;
    this.tienKhachDua = 0;
    this.tienThuaTraKhach = 0;
    this.countQuantity = 0;
  }

  removeTab(index: number) {
    const createOrder = {
      id: this.idOrder,
      customer: {
        id: 167
      },
      staff: {
        id: this.storageService.getIdFromToken()
      },
      shipAddress: 'Tai quay',
      createDate: new Date(),
      paymentType: 0,
      status: 4,
      total: this.tongTienHang,
      discount: this.giamGia,
      totalPayment: this.tienKhachCanTra,
      feeShipping: 0,
      type: 1,
      description: ''
    }

    const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Hủy hóa đơn',
        message: 'Bạn có muốn hủy hóa đơn không ?',
      }
    });
    diaLogRef.afterClosed().subscribe((data: any) => {
      if (data == this.RESULT_CLOSE_DIALOG.CONFIRM) {
        if (this.tabs.length > 1) {
          this.orderService.updateHuy(this.idOrder, createOrder).subscribe((data: any) => {
            console.log('Sau khi sua: ', data);
            this.orderDetails = [];
            this.idHoaDon.splice(index, 1);
            this.tabs.splice(index, 1);
            this.selected.setValue(this.tabs.length - 1);
            this.defaultPayment();
            this.getOrderDetail()
            this.toastService.success('Hủy hóa đơn thành công !');
          }, error => {
            this.toastService.error('Hủy hóa đơn thất bại !');
            console.log(error);
          })
        } else {
          this.orderService.updateHuy(this.idOrder, createOrder).subscribe((data: any) => {
            console.log('Sau khi sua: ', data);
            this.defaultPayment();
            this.orderDetails = [];
            this.idHoaDon = [];
            this.tabs = [];
            this.toastService.success('Hủy hóa đơn thành công !');
          }, error => {
            this.toastService.error('Hủy hóa đơn thất bại !');
            console.log(error);
          })
        }
      }
    })
  }

  addOrder(idProduct: any) {
    const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Chọn sản phẩm',
        message: 'Bạn có muốn thêm sản phẩm vào hóa đơn không ?',
      }
    });
    diaLogRef.afterClosed().subscribe((data: any) => {
      if (data == this.RESULT_CLOSE_DIALOG.CONFIRM) {
        if (this.tabs.length == 0) {
          this.toastService.warning('Vui lòng tạo hóa đơn trước !');
        } else {
          this.productDetailService.findPriceProductDetail(idProduct).subscribe((data: any) => {
            this.orderDetailService.saveOrderDetail(this.createProductAtOrderDetail(idProduct, this.idOrder, 1, data.price)).subscribe((data2: any) => {
              this.getOrderDetail();
              this.toastService.success('Thêm sản phẩm thành công !');
              this.getDiscount(idProduct);
              this.orderDetailService.quantityPrd$.subscribe(rs => {
                this.countQuantity = rs;
              })
            }, error => {
              this.toastService.error('Thêm sản phẩm thất bại !');
              console.log(error)
            })
          })
        }
      }
    })
  }

  deleteOrderDetail(idProduct: number) {
    const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Xóa sản phẩm',
        message: 'Bạn có muốn xóa sản phẩm khỏi hóa đơn không ?',
      }
    });
    diaLogRef.afterClosed().subscribe((data: any) => {
      if (data == this.RESULT_CLOSE_DIALOG.CONFIRM) {
        this.orderDetailService.delete(idProduct);
        this.orderDetailService.isReLoading.subscribe(data => {
          if (data) {
            this.getOrderDetail();
            this.orderDetailService.isReLoading.next(false);
          }
        })
      }
    })
  }

  updateOrderDetail(data: any, type?: any, event?: any) {
    let soLuong = event?.target.value;

    if (soLuong > data.productDetail.quantity) {
      this.toastService.warning('Trong kho còn ' + data.productDetail.quantity + ' sản phẩm');
      event.target.value = data.quantity;
      return;
    }

    if (soLuong <= 0 || soLuong === "") {
      this.deleteOrderDetail(data.productDetail.id);
      return;
    }

    this.createProductAtOrderDetail(data.productDetail.id, this.idOrder, parseInt(soLuong), data.price);
    this.orderDetailService.updateQuantityOrderDetail(this.addProduct);
    this.orderDetailService.isReLoading.subscribe(data => {
      if (data) {
        this.getOrderDetail();
        this.orderDetailService.isReLoading.next(false);
      }
    })
  }

  setDataOrder() {
    this.createOrder = {
      customer: {
        id: 167
      },
      staff: {
        id: this.storageService.getIdFromToken()
      },
      shipAddress: 'Tai quay',
      createDate: new Date(),
      paymentType: 0,
      status: 0,
      total: 0,
      discount: 0,
      totalPayment: 0,
      feeShipping: 0,
      type: 1,
      description: ''
    }
  }

  createProductAtOrderDetail(idProduct: number, idOrder: number, quantity: number, price: number) {
    this.addProduct = {
      productDetail: {
        id: idProduct
      },
      order: {
        id: idOrder
      },
      quantity: quantity,
      price: price
    };
    return this.addProduct;
  }

  getOrderDetailByOrder(name: number) {
    let id = this.idHoaDon.filter(n => n.name == name)[0].value;
    console.log('id : ', id);
    this.idOrder = id;
    this.orderDetailService.findOrderDetailByOrder(this.idOrder).subscribe((data: any) => {
      this.orderDetails = data;
    });
    this.getOrderDetail();
    console.log('select tab value: ', this.selected.value);
  }

  getOrderByStaff(id: number) {
    this.orderService.getOrderByStaff(id).subscribe((data: any) => {
      console.log(data);
    })
  }

  getOrderDetail() {
    let soLuong = 0
    this.orderDetailService.findOrderDetailByOrder(this.idOrder).subscribe((data: any) => {
      this.promotionDetailService.getPromotional(this.idOrder).subscribe((data2: any) => {
        this.tongTienHang = 0;
        this.tienKhachCanTra = 0;
        this.giamGia = 0;
        this.orderDetails = data;
        console.log(data2.promotional)
        for (const d of data) {
          this.tongTienHang += d.price * d.quantity;
          soLuong += d.quantity;
          for (const pp of data2) {
            if (d.productDetail.id == pp.productDetail.id) {
              this.giamGia += d.price * (pp.promotional.discount / 100) * d.quantity;
            }
          }
          this.orderDetailService.quantityPrd$.next(soLuong);
        }
        this.tienKhachCanTra = Math.round(this.tongTienHang - this.giamGia);
        this.tienThuaTraKhach = this.formMoney.getRawValue().tienKhachDua - this.tienKhachCanTra
      })
    })
    console.log('id order cua getOrderDetail: ', this.idOrder)
  }

  getOrder() {
    this.orderService.getOrderById(this.idOrder).subscribe((data: any) => {
      this.orders = data;
    })
  }

  payment() {
    let index: number;
    const createOrder = {
      id: this.idOrder,
      customer: {
        id: this.formGroupCustomer.getRawValue().customer.id
      },
      staff: {
        id: this.storageService.getIdFromToken()
      },
      shipAddress: 'Tai quay',
      createDate: new Date(),
      paymentType: 0,
      status: 3,
      total: this.tongTienHang,
      discount: this.giamGia,
      totalPayment: this.tienKhachCanTra,
      feeShipping: 0,
      type: 1,
      description: this.formGroupCustomer.getRawValue().description
    }

    const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        title: 'Thanh toán',
        message: 'Bạn có muốn thanh toán hóa đơn này không ?',
      }
    });
    diaLogRef.afterClosed().subscribe((data: any) => {
      if (data == this.RESULT_CLOSE_DIALOG.CONFIRM) {
        if (this.tabs.length == 0) {
          this.toastService.warning('Vui lòng tạo hóa đơn để tiến hành thanh toán !');
        } else if (this.tongTienHang == 0) {
          this.toastService.warning('Vui lòng chọn sản phẩm trước !');
        } else if (this.tienKhachDua == 0) {
          this.toastService.warning('Vui lòng nhập tiền khách đưa !');
        } else if (this.tienKhachDua < this.tienKhachCanTra) {
          this.toastService.warning('Tiền khách đưa không được bé hơn tiền khách cần trả !');
        } else {
          this.orderService.updateMua(this.idOrder, createOrder).subscribe((data: any) => {
            console.log('Sau khi thanh toan: ', data);
            this.toastService.success('Thanh toán thành công !');
            this.defaultPayment();
            this.tabs.splice(index, 1);
            this.idHoaDon.splice(index, 1)
            this.orderDetails = [];
            // this.tienThuaTraKhach = this.formMoney.getRawValue().tienKhachDua - createOrder.totalPayment
            this.openExportOrder(this.idOrder);
          }, error => {
            this.toastService.error('Thanh toán thất bại !');
            console.log(error);
          })
        }
      }
    })
  }

  openExportOrder(id: any) {
    const dialogRef = this.matDiaLog.open(OrderSellComponent, {
      width: '1500px',
      height: '100%',
      disableClose: true,
      hasBackdrop: true,
      data: {id}
    });
    dialogRef.afterClosed().subscribe(rs => {
      console.log('id de in hoa don: ', id);
    })
  }

  openScannerBarcode() {
    const dialogRef = this.matDiaLog.open(ScannerFormComponent, {
      width: '500px',
      disableClose: true,
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((rs: any) => {
      this.addOrder(rs.id);
    })

  }

  logout() {
    this.matDiaLog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Đăng xuất',
        message: 'Bạn muốn đăng xuất tài khoản này ?'
      }
    }).afterClosed().subscribe(result => {
      if (result == Constants.RESULT_CLOSE_DIALOG.CONFIRM) {
        this.authService.logout();
      }
    })
  }

  openInfoUser() {
    this.matDiaLog.open(ChangeInfoLoginComponent, {
      width: '800px',
      disableClose: true,
    })
  }

  backToHome() {
    this.router.navigate(['/order-management']);
  }
}

// Code thua`

// export(idOrder: number) {
//   const diaLogRef = this.matDiaLog.open(ConfirmDialogComponent, {
//     width: '400px',
//     disableClose: true,
//     hasBackdrop: true,
//     data: {
//       title: 'In hóa đơn',
//       message: 'Bạn có muốn in hóa đơn không ?',
//     }
//   });
//   diaLogRef.afterClosed().subscribe((rs: any) => {
//     if (rs === this.RESULT_CLOSE_DIALOG.CONFIRM) {
//       this.orderService.exportOrder(idOrder).subscribe((data: any) => {
//         this.toastService.success("Đã in hóa đơn!");
//         console.log(data);
//       }, error => {
//         this.toastService.error("In hóa đơn thất bại!");
//         console.log(error);
//       })
//     }
//   })
// }


// if (this.tabs.length > 0) {
//   this.toastService.warning('Vui lòng thưc hiện hết thao tác trước khi trở về trang chủ !');
//   return;
// } else {
//   this.router.navigate(['/']);
// }
