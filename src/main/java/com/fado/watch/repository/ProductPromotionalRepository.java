package com.fado.watch.repository;

import com.fado.watch.entity.ProductDetail;
import com.fado.watch.entity.ProductPromotional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPromotionalRepository extends JpaRepository<ProductPromotional, Integer> {

    //    @Query("select p from product_details p where p.id not in (select c.productDetail.id from product_promotionals c)")

    //    @Query("select p from product_details p where p.id not in\n" +
//            "(select c.productDetail.id from product_promotionals c where c.promotional.id not in\n" +
//            "(select d.id from promotionals d where d.id =:idPromotional and d.status = 1))")
//    @Query("select p from product_details p where p.id not in (select c.productDetail.id from product_promotionals c where c.promotional.id =:idPromotional)")
// @Param("idPromotional") Integer idPromotional
    @Query("select p from product_details p where p.id not in( \n" +
            "     select pp.productDetail.id from product_promotionals pp join promotionals p on pp.promotional.id = p.id\n" +
            "     where p.status = 1 or p.status = 2)  and p.status = 1")
    List<ProductDetail> getProductNotInPromotional();


    @Query("select pp from product_promotionals pp where pp.promotional.status = 1 and pp.productDetail.id in" +
            "(select c.productDetail.id from carts c where c.customer.id = :idCtm)")
    List<ProductPromotional> findAllProductPromotionalInCart(@Param("idCtm") Integer idCtm);

    @Query("SELECT pp FROM product_promotionals pp WHERE pp.productDetail.id IN (:id) AND pp.promotional.status = 1")
    List<ProductPromotional> findProductPromotionalByIdProductDetail(@Param("id") Integer[] id);
    
    @Query("select pp from product_promotionals pp where pp.promotional.status = 1 and pp.productDetail.id in " +
            "(select od.productDetail.id from order_details od where od.order.id = :idO)")
    List<ProductPromotional> getPromotional(@Param("idO") Integer idOder);

    @Query("select pp.promotional.discount from product_promotionals pp where pp.promotional.status = 1 and pp.productDetail.id = :idPd")
    Integer getDiscountProduct(@Param("idPd") Integer idPd);
}