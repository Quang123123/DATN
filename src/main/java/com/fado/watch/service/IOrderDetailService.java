package com.fado.watch.service;

import com.fado.watch.dto.request.CartRequest;
import com.fado.watch.entity.OrderDetail;

import java.util.List;

public interface IOrderDetailService {

    List<OrderDetail> getAll();

    List<OrderDetail> findAllDetailByCustomerId(Integer id);

    List<OrderDetail> getAllOrderDetailInOrder(Integer id);

    void save(CartRequest response);


    // Day la` pha`n toi nha' ba.n hien da.u da.u
    void saveOrderDetail(OrderDetail orderDetail);

    OrderDetail updateQuantityOrderDetail(OrderDetail orderDetail);

    void delete(Integer idPro);

    List<OrderDetail> findOrderDetailByOrder(Integer id);

    List<OrderDetail> getHistory(Integer status);


}
