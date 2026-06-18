package com.example.sms.controller;

import com.example.sms.dto.ApiResponse;
import com.example.sms.dto.AttendanceDTO;
import com.example.sms.dto.AttendanceStatsDTO;
import com.example.sms.dto.MarkAttendanceRequest;
import com.example.sms.entity.StudentEntity;
import com.example.sms.repository.StudentRepository;
import com.example.sms.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StudentRepository studentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/mark")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> markAttendance(@RequestBody List<MarkAttendanceRequest> requests) {
        List<AttendanceDTO> saved = attendanceService.markAttendance(requests);
        return new ResponseEntity<>(ApiResponse.success("Attendance marked successfully", saved), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendanceByDate(
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDTO> records = attendanceService.getAttendanceByDate(date);
        return new ResponseEntity<>(ApiResponse.success("Fetched attendance by date", records), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendanceByStudent(@PathVariable("studentId") Integer studentId) {
        List<AttendanceDTO> records = attendanceService.getAttendanceByStudent(studentId);
        return new ResponseEntity<>(ApiResponse.success("Fetched attendance for student", records), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<ApiResponse<AttendanceStatsDTO>> getAttendanceStatsByStudent(@PathVariable("studentId") Integer studentId) {
        AttendanceStatsDTO stats = attendanceService.getAttendanceStats(studentId);
        return new ResponseEntity<>(ApiResponse.success("Fetched student stats", stats), HttpStatus.OK);
    }

    // STUDENT ENDPOINTS

    private StudentEntity getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // This now returns email
        return studentRepository.findFirstByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Logged in user has no student profile"));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getMyAttendance() {
        StudentEntity student = getCurrentStudent();
        List<AttendanceDTO> records = attendanceService.getAttendanceByStudent(student.getId());
        return new ResponseEntity<>(ApiResponse.success("Fetched your attendance history", records), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my/stats")
    public ResponseEntity<ApiResponse<AttendanceStatsDTO>> getMyAttendanceStats() {
        StudentEntity student = getCurrentStudent();
        AttendanceStatsDTO stats = attendanceService.getAttendanceStats(student.getId());
        return new ResponseEntity<>(ApiResponse.success("Fetched your attendance stats", stats), HttpStatus.OK);
    }
}
