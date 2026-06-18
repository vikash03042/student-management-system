package com.example.sms.dto;

import com.example.sms.entity.AttendanceStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MarkAttendanceRequest {
    private Integer studentId;
    private LocalDate date;
    private AttendanceStatus status;
}
