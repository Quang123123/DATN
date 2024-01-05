import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiConstant} from "../../constants/api-constant";

@Injectable({
  providedIn: 'root'
})
export class ApiOrderService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getALl() {
    return this.http.get(ApiConstant.order);
  }

  findAllByCustomerId(id: number) {
    return this.http.get(`${ApiConstant.order}/findAllByCustomerId/${id}`);
  }

  changeInfoOrder(data: any) {
    return this.http.put(`${ApiConstant.order}/changeInfoOrder`, data);
  }

  save(data: any) {
    return this.http.post(ApiConstant.order, data);
  }

  updateMua(idOrder: any,data: any) {
    return this.http.put(`${ApiConstant.order}/payment/${idOrder}`, data);
  }

  updateHuy(idOrder: any,data: any) {
    return this.http.put(`${ApiConstant.order}/cancel/${idOrder}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${ApiConstant.order}/${id}`);
  }
  chartBar() {
    return this.http.get(`${ApiConstant.order}/chartBar`);
  }
  totalRevenue() {
    return this.http.get(`${ApiConstant.order}/totalRevenue`);
  }
  totalOrder() {
    return this.http.get(`${ApiConstant.order}/totalOrder`);
  }
  orderCancel() {
    return this.http.get(`${ApiConstant.order}/orderCancel`);
  }
  totalOneDay() {
    return this.http.get(`${ApiConstant.order}/totalOneDay`);
  }
  getListTop() {
    return this.http.get(`${ApiConstant.order}/getListTop`);
  }
  getOrderByStaff(id: number) {
    return this.http.get(`${ApiConstant.order}/getOrderByStaff/${id}`)
  }

  getOrderById(id: number) {
    return this.http.get(`${ApiConstant.order}/getOrderById?id=${id}`)
  }

  findById(id: number) {
    return this.http.get(`${ApiConstant.order}/${id}`)
  }

  updateStatus(status: number, id: number) {
    return this.http.get(`${ApiConstant.order}/updateStatus?status=${status}&id=${id}`)
  }

  revertOrder(description: string, id: number) {
    return this.http.get(`${ApiConstant.order}/revertOrder?description=${description}&id=${id}`)
  }

  getOrderHistory(id: number, status: number) {
    return this.http.get(`${ApiConstant.order}/getOrderHistory?id=${id}&status=${status}`)
  }

  exportOrder(id: number) {
    return this.http.get(`${ApiConstant.order}/export/${id}`);
  }

  filterOrder(data: any) {
    return this.http.post(`${ApiConstant.order}/filterOrder`, data);
  }

  getListOrder(idNV: any) {
    return this.http.get(`${ApiConstant.order}/listOrder/${idNV}`);
  }
}
