package com.app.pis.dto;

import com.app.pis.entity.Employee;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeWithAccountResponse {
    private Employee employee;
    private AccountResponse account;
}
