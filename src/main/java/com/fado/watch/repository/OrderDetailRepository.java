package com.fado.watch.repository;

import com.fado.watch.entity.Order;
import com.fado.watch.entity.OrderDetail;
import com.fado.watch.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    @Query("select o from order_details o where o.order.customer.id =:id")
    List<OrderDetail> findAllDetailByCustomerId(Integer id);

    List<OrderDetail> findAllByOrderId(Integer id);


    // Day la` pha`n toi nha' ba.n hien da.u da.u
    @Query("select o from order_details o where o.order.id =:id and o.order.type = 1")
    List<OrderDetail> findOrderDetailByOrder(@Param("id") Integer id);

    @Query("select o from order_details o where o.order.id =:id and o.order.type = 1")
    OrderDetail findOrderDetailByOrderId(Integer id);

    @Query("select o from order_details o where o.productDetail.id =:idProduct and o.order.id =:idOrder")
    OrderDetail checkTrungSP(@Param("idProduct") Integer idProduct, @Param("idOrder") Integer idOrder);

    @Modifying
    @Transactional
    @Query("delete from order_details o where o.productDetail.id = :idPro")
    void deleteByIdProduct(@Param("idPro") Integer idPro);

    @Query("select od from order_details od where od.order.type = 1 and od.order.status =:status")
    List<OrderDetail> getHistory(@Param("status") Integer status);

    @Query("select od.order.status from order_details od where od.order.id = :id")
    Integer getStatus(@Param("id") Integer id);

}