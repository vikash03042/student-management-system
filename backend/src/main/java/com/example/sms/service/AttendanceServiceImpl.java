package com.example.sms.service;

import com.example.sms.dto.AttendanceDTO;
import com.example.sms.dto.AttendanceStatsDTO;
import com.example.sms.dto.MarkAttendanceRequest;
import com.example.sms.entity.AttendanceEntity;
import com.example.sms.entity.AttendanceStatus;
import com.example.sms.entity.StudentEntity;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    private AttendanceDTO mapToDTO(AttendanceEntity entity) {
        return new AttendanceDTO(
                entity.getId(),
                entity.getStudent().getId(),
                entity.getStudent().getName(),
                entity.getDate(),
                entity.getStatus()
        );
    }

    @Override
    public List<AttendanceDTO> markAttendance(List<MarkAttendanceRequest> requests) {
        List<AttendanceEntity> savedEntities = new ArrayList<>();

        for (MarkAttendanceRequest request : requests) {
            StudentEntity student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + request.getStudentId()));

            Optional<AttendanceEntity> existing = attendanceRepository.findByStudentIdAndDate(student.getId(), request.getDate());
            
            AttendanceEntity attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(request.getStatus());
            } else {
                attendance = new AttendanceEntity();
                attendance.setStudent(student);
                attendance.setDate(request.getDate());
                attendance.setStatus(request.getStatus());
            }
            savedEntities.add(attendanceRepository.save(attendance));
        }

        return savedEntities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByStudent(Integer studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceStatsDTO getAttendanceStats(Integer studentId) {
        List<AttendanceEntity> records = attendanceRepository.findByStudentId(studentId);
        
        int totalDays = records.size();
        int presentDays = (int) records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        int absentDays = totalDays - presentDays;
        
        double percentage = totalDays == 0 ? 0.0 : ((double) presentDays / totalDays) * 100.0;

        return new AttendanceStatsDTO(totalDays, presentDays, absentDays, Math.round(percentage * 100.0) / 100.0);
    }
}
