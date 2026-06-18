package com.example.sms.repository;

import com.example.sms.entity.FeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<FeeEntity, Integer> {
    
    List<FeeEntity> findByStudentIdOrderByPaymentDateDesc(Integer studentId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeEntity f WHERE f.status = 'PAID'")
    Double sumAllPaidFees();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeEntity f WHERE f.student.id = :studentId AND f.status = 'PAID'")
    Double sumPaidFeesByStudent(@Param("studentId") Integer studentId);
}
