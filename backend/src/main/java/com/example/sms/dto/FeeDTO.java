package com.example.sms.dto;

import com.example.sms.entity.FeeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeeDTO {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private String courseName;
    private Double amount;
    private LocalDate paymentDate;
    private FeeStatus status;
}
