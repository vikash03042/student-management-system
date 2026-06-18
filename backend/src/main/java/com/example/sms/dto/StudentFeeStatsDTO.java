package com.example.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentFeeStatsDTO {
    private Double courseFees;
    private Double totalPaid;
    private Double remainingBalance;
}
