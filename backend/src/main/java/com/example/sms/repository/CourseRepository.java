package com.example.sms.repository;

import com.example.sms.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Integer> {
    boolean existsByCourseName(String courseName);
    boolean existsByCourseNameAndIdNot(String courseName, Integer id);
}
