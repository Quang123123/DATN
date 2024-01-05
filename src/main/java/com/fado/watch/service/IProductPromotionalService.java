package com.fado.watch.service;

import com.fado.watch.entity.ProductDetail;
import com.fado.watch.entity.ProductPromotional;

import java.util.List;

public interface IProductPromotionalService {

    List<ProductPromotional> getAll();

    List<ProductDetail> getProductNotInPromotional();

    List<ProductPromotional> findAllProductPromotionalInCart(Integer idCtm);

    ProductPromotional getById(Integer id);

    ProductPromotional[] create(ProductPromotional[] promotional);

    ProductPromotional[] update(ProductPromotional[] promotional);

    void delete(List<Integer> id);

    List<ProductPromotional> findProductPromotionalByIdProductDetail(Integer[] id);

    List<ProductPromotional> getPromotional(Integer idOrder);

    Integer getDiscountProduct(Integer idPd);
}
