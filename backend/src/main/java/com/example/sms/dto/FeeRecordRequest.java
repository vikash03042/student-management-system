package com.example.sms.dto;

import com.example.sms.entity.FeeStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FeeRecordRequest {
    @NotNull(message = "Student ID is required")
    private Integer studentId;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than zero")
    private Double amount;

    @NotNull(message = "Payment Date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Status is required")
    private FeeStatus status;
}
