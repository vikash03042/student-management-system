package com.example.sms.service;

import com.example.sms.entity.CourseEntity;
import java.util.List;

public interface CourseService {
    CourseEntity addCourse(CourseEntity course);
    List<CourseEntity> getAllCourses();
    CourseEntity getCourseById(Integer id);
    void deleteCourse(Integer id);
    CourseEntity updateCourse(Integer id, CourseEntity course);
}
