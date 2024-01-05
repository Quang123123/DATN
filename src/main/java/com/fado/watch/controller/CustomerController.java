package com.fado.watch.controller;

import com.fado.watch.dto.request.ChangePassModel;
import com.fado.watch.entity.Customer;
import com.fado.watch.exception.WrongPasswordException;
import com.fado.watch.service.ICustomerService;
import com.fado.watch.service.ISendEmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private final ICustomerService iCustomerService;

    private final ISendEmailService sendEmailService;

    public CustomerController(ICustomerService iCustomerService, ISendEmailService iSendEmailService) {
        this.iCustomerService = iCustomerService;
        this.sendEmailService = iSendEmailService;
    }


    @GetMapping
    public ResponseEntity<List<Customer>> findAll(){
       return new ResponseEntity<>(this.iCustomerService.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Customer> findById(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(this.iCustomerService.findbyId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Customer> create(@RequestBody Customer customer) {
        return new ResponseEntity<>(this.iCustomerService.create(customer), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<Customer> update(@RequestBody Customer customer) {
        return new ResponseEntity<>(this.iCustomerService.update(customer), HttpStatus.OK);
    }

    @PostMapping("/findCustomerByEmailAndSendOTP")
    public ResponseEntity<Customer> findCustomerByEmailAndSendOTP(@RequestBody String email) {
        if (iCustomerService.existsByEmail(email)){
            sendEmailService.sendMailOTP(email);
        }
        return new ResponseEntity<>(this.iCustomerService.findCustomerByEmail(email), HttpStatus.OK);
    }

    @PostMapping("/accuracyPassword")
    public ResponseEntity<Customer> accuracyPassword(@RequestBody ChangePassModel changePassModel) {
        Customer customer = iCustomerService.checkPassAndFindCustomer(changePassModel);
        if (customer == null){
            throw new WrongPasswordException("Mật khẩu hiện tại không chính xác!");
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }
}
