package com.fado.watch.service.impl;

import com.fado.watch.dto.response.CartPriceResponse;
import com.fado.watch.dto.response.StatusCheckPromotionalDto;
import com.fado.watch.entity.Cart;
import com.fado.watch.entity.ProductPromotional;
import com.fado.watch.repository.CartRepository;
import com.fado.watch.repository.ProductPromotionalRepository;
import com.fado.watch.repository.PromotionalRepository;
import com.fado.watch.service.ICartService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@AllArgsConstructor
public class CartServiceImpl implements ICartService {

    static Integer idCtm;
    static List<Integer> listId = new ArrayList<>();

    static List<ProductPromotional> listPrmCu;
    static List<StatusCheckPromotionalDto> listStatusCu;

    private final CartRepository cartRepository;
    private final ProductPromotionalRepository productPromotionalRepository;
    private final PromotionalRepository promotionalRepository;

    @Override
    public Cart addToCart(Cart cart) {
        Cart newCart = this.cartRepository.checkTrung(cart.getProductDetail().getId(), cart.getCustomer().getId());
        if (newCart == null) {
            newCart = new Cart();
            newCart.setProductDetail(cart.getProductDetail());
            newCart.setCustomer(cart.getCustomer());
            newCart.setQuantity(cart.getQuantity());
        } else {
            newCart.setQuantity(newCart.getQuantity() + cart.getQuantity());
        }
        return this.cartRepository.save(newCart);
    }

    @Override
    public Cart updateQuantity(Cart cart) {
        Cart newCart = this.cartRepository.checkTrung(cart.getProductDetail().getId(), cart.getCustomer().getId());

        newCart.setQuantity(cart.getQuantity());
        return this.cartRepository.save(newCart);
    }

    @Override
    public void delete(Integer id) {
        this.cartRepository.deleteById(id);
    }

    @Override
    public void deleteAllByCustomerId(Integer id) {
        this.cartRepository.deleteAllByCustomerId(id);
    }


    //
    @Override
    public List<CartPriceResponse> findAllByCustomerId(Integer id) {
        idCtm = id;
        listPrmCu = new ArrayList<>();
        listStatusCu = new ArrayList<>();


        List<ProductPromotional> productPromotionals = this.productPromotionalRepository.findAllProductPromotionalInCart(id);
        listPrmCu = productPromotionals;
        List<CartPriceResponse> cartList = this.cartRepository.findAllByCustomerId(id);
        if (null == productPromotionals) {
            return cartList;
        }
        for (CartPriceResponse x : cartList) {
            for (ProductPromotional y : productPromotionals) {
                if (Objects.equals(x.getProductDetail().getId(), y.getProductDetail().getId())) {
                    listId.add(y.getPromotional().getId());
                    if (y.getPromotional().isType()) {
                        x.setPrice(x.getProductDetail().getPrice() - (x.getProductDetail().getPrice() * y.getPromotional().getDiscount() / 100));
                        break;
                    } else {
                        x.setPrice(x.getPrice() - y.getPromotional().getDiscount());
                        break;
                    }
                }
            }
        }
        listStatusCu = this.promotionalRepository.checkStatusById(listId);
        return cartList;
    }

    @Override
    public boolean checkPromotionalInCartByIdCtm() {
        List<ProductPromotional> listPrmMoi = this.productPromotionalRepository.findAllProductPromotionalInCart(idCtm);


        List<StatusCheckPromotionalDto> listStatusMoi = this.promotionalRepository.checkStatusById(listId);
        if (listPrmMoi.size() < listPrmCu.size() || listPrmMoi.size() > listPrmCu.size()) {
            return true;
        }
        if (listStatusCu.size() < listStatusMoi.size() || listStatusCu.size() > listStatusMoi.size()) {
            return true;
        }
        for (int i = 0; i < listPrmCu.size(); i++) {
            if (!(Objects.equals(listPrmCu.get(i).getProductDetail().getId(), listPrmMoi.get(i).getProductDetail().getId())
                    && Objects.equals(listPrmCu.get(i).getPromotional().getId(), listPrmMoi.get(i).getPromotional().getId()))) {
                return true;
            }
        }
        for (int i = 0; i < listStatusCu.size(); i++) {
            if (!Objects.equals(listStatusCu.get(i).getStatus(), listStatusMoi.get(i).getStatus())) {
                return true;
            }
        }
        for (ProductPromotional x: listPrmCu) {
            for (ProductPromotional y: listPrmMoi) {
                if (Objects.equals(x.getPromotional().getId(), y.getPromotional().getId()) && !Objects.equals(x.getPromotional().getDiscount(), y.getPromotional().getDiscount())){
                    return true;
                }
            }
        }
        return false;
    }
}
