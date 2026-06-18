package com.example.sms.controller;

import com.example.sms.dto.*;
import com.example.sms.entity.StudentEntity;
import com.example.sms.repository.StudentRepository;
import com.example.sms.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fees")
@CrossOrigin("*")
public class FeeController {

    @Autowired
    private FeeService feeService;

    @Autowired
    private StudentRepository studentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<FeeDTO>> recordFee(@Valid @RequestBody FeeRecordRequest request) {
        FeeDTO fee = feeService.recordFee(request);
        return new ResponseEntity<>(ApiResponse.success("Fee recorded successfully", fee), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<FeeDTO>>> getAllFees() {
        List<FeeDTO> fees = feeService.getAllFees();
        return new ResponseEntity<>(ApiResponse.success("Fetched all fees", fees), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<GlobalFeeStatsDTO>> getGlobalStats() {
        GlobalFeeStatsDTO stats = feeService.getGlobalStats();
        return new ResponseEntity<>(ApiResponse.success("Fetched global fee stats", stats), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FeeDTO>>> getFeesByStudent(@PathVariable Integer studentId) {
        List<FeeDTO> fees = feeService.getFeesByStudent(studentId);
        return new ResponseEntity<>(ApiResponse.success("Fetched student fee records", fees), HttpStatus.OK);
    }

    // STUDENT ENDPOINTS

    private StudentEntity getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepository.findFirstByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Logged in user has no student profile"));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<FeeDTO>>> getMyFees() {
        StudentEntity student = getCurrentStudent();
        List<FeeDTO> fees = feeService.getFeesByStudent(student.getId());
        return new ResponseEntity<>(ApiResponse.success("Fetched your fee records", fees), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my/stats")
    public ResponseEntity<ApiResponse<StudentFeeStatsDTO>> getMyFeeStats() {
        StudentEntity student = getCurrentStudent();
        StudentFeeStatsDTO stats = feeService.getStudentStats(student.getId());
        return new ResponseEntity<>(ApiResponse.success("Fetched your fee stats", stats), HttpStatus.OK);
    }
}
