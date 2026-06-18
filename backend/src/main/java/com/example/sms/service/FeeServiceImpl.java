package com.example.sms.service;

import com.example.sms.dto.FeeDTO;
import com.example.sms.dto.FeeRecordRequest;
import com.example.sms.dto.GlobalFeeStatsDTO;
import com.example.sms.dto.StudentFeeStatsDTO;
import com.example.sms.entity.FeeEntity;
import com.example.sms.entity.StudentEntity;
import com.example.sms.repository.FeeRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeServiceImpl implements FeeService {

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private StudentRepository studentRepository;

    private FeeDTO mapToDTO(FeeEntity entity) {
        String courseName = entity.getStudent().getCourse() != null ? entity.getStudent().getCourse().getCourseName() : "N/A";
        return new FeeDTO(
                entity.getId(),
                entity.getStudent().getId(),
                entity.getStudent().getName(),
                courseName,
                entity.getAmount(),
                entity.getPaymentDate(),
                entity.getStatus()
        );
    }

    @Override
    public FeeDTO recordFee(FeeRecordRequest request) {
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        FeeEntity fee = new FeeEntity();
        fee.setStudent(student);
        fee.setAmount(request.getAmount());
        fee.setPaymentDate(request.getPaymentDate());
        fee.setStatus(request.getStatus());

        FeeEntity savedFee = feeRepository.save(fee);

        return mapToDTO(savedFee);
    }

    @Override
    public List<FeeDTO> getAllFees() {
        return feeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeeDTO> getFeesByStudent(Integer studentId) {
        return feeRepository.findByStudentIdOrderByPaymentDateDesc(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GlobalFeeStatsDTO getGlobalStats() {
        Double expected = studentRepository.sumAllExpectedFees();
        Double paid = feeRepository.sumAllPaidFees();
        Double pending = Math.max(0, expected - paid);
        return new GlobalFeeStatsDTO(expected, paid, pending);
    }

    @Override
    public StudentFeeStatsDTO getStudentStats(Integer studentId) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Double expected = student.getCourse() != null ? student.getCourse().getFees() : 0.0;
        Double paid = feeRepository.sumPaidFeesByStudent(studentId);
        Double balance = Math.max(0, expected - paid);

        return new StudentFeeStatsDTO(expected, paid, balance);
    }
}
