package com.example.sms.dto;

import com.example.sms.entity.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private LocalDate date;
    private AttendanceStatus status;
}
