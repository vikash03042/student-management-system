package com.example.sms.service;

import com.example.sms.entity.CourseEntity;
import com.example.sms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public CourseEntity addCourse(CourseEntity course) {
        if (courseRepository.existsByCourseName(course.getCourseName())) {
            throw new RuntimeException("Course with this name already exists");
        }
        return courseRepository.save(course);
    }

    @Override
    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public CourseEntity getCourseById(Integer id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    @Override
    public void deleteCourse(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    public CourseEntity updateCourse(Integer id, CourseEntity updatedCourse) {
        CourseEntity existing = getCourseById(id);

        if (courseRepository.existsByCourseNameAndIdNot(updatedCourse.getCourseName(), id)) {
            throw new RuntimeException("Course with this name already exists");
        }

        existing.setCourseName(updatedCourse.getCourseName());
        existing.setDuration(updatedCourse.getDuration());
        existing.setFees(updatedCourse.getFees());
        existing.setDescription(updatedCourse.getDescription());

        return courseRepository.save(existing);
    }
}
