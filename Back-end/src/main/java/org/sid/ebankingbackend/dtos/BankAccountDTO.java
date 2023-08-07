package org.sid.ebankingbackend.dtos;

import lombok.Data;

import java.util.Date;

@Data
public class BankAccountDTO {
    private String type;
    private String id;
    private double balance;
    private Date createdAt;
}
