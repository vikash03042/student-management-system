package com.example.sms.repository;

import com.example.sms.entity.AttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceEntity, Integer> {
    List<AttendanceEntity> findByStudentId(Integer studentId);
    List<AttendanceEntity> findByDate(LocalDate date);
    Optional<AttendanceEntity> findByStudentIdAndDate(Integer studentId, LocalDate date);
}
