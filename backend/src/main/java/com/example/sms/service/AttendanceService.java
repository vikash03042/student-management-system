package com.example.sms.service;

import com.example.sms.dto.AttendanceDTO;
import com.example.sms.dto.AttendanceStatsDTO;
import com.example.sms.dto.MarkAttendanceRequest;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> markAttendance(List<MarkAttendanceRequest> requests);
    List<AttendanceDTO> getAttendanceByDate(LocalDate date);
    List<AttendanceDTO> getAttendanceByStudent(Integer studentId);
    AttendanceStatsDTO getAttendanceStats(Integer studentId);
}
