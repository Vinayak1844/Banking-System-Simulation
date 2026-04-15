package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Name can not be empty")
    private String name;

    @Email(message = "Email is invalid")
    @NotBlank
    private String email;

    @Size(min = 6,message = "Password should be atleast 6 chars")
    private String password;
}
