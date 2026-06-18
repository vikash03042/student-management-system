package com.example.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GlobalFeeStatsDTO {
    private Double totalExpected;
    private Double totalPaid;
    private Double totalPending;
}
