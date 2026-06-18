package com.example.sms.service;

import com.example.sms.dto.FeeDTO;
import com.example.sms.dto.FeeRecordRequest;
import com.example.sms.dto.GlobalFeeStatsDTO;
import com.example.sms.dto.StudentFeeStatsDTO;

import java.util.List;

public interface FeeService {
    FeeDTO recordFee(FeeRecordRequest request);
    List<FeeDTO> getAllFees();
    List<FeeDTO> getFeesByStudent(Integer studentId);
    GlobalFeeStatsDTO getGlobalStats();
    StudentFeeStatsDTO getStudentStats(Integer studentId);
}
