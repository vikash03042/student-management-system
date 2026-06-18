package com.example.sms.repository;

import com.example.sms.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
    boolean existsByRoll(Integer roll);
    boolean existsByRollAndIdNot(Integer roll, Integer id);

    @Query("SELECT s FROM StudentEntity s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.course.courseName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(s.roll AS string) LIKE CONCAT('%', :search, '%')")
    Page<StudentEntity> searchAllFields(@Param("search") String search, Pageable pageable);

    Page<StudentEntity> findByUser_Email(String email, Pageable pageable);
    java.util.Optional<StudentEntity> findFirstByUser_Email(String email);

    @Query("SELECT COALESCE(SUM(s.course.fees), 0) FROM StudentEntity s WHERE s.course IS NOT NULL")
    Double sumAllExpectedFees();
}
