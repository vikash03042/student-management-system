package com.example.sms.controller;

import com.example.sms.dto.ApiResponse;
import com.example.sms.entity.CourseEntity;
import com.example.sms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin("*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CourseEntity>> addCourse(@Valid @RequestBody CourseEntity course) {
        CourseEntity savedCourse = courseService.addCourse(course);
        return new ResponseEntity<>(ApiResponse.success("Course added successfully", savedCourse), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseEntity>>> getAllCourses() {
        List<CourseEntity> courses = courseService.getAllCourses();
        return new ResponseEntity<>(ApiResponse.success("Fetched all courses", courses), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseEntity>> getCourseById(@PathVariable("id") Integer id) {
        CourseEntity course = courseService.getCourseById(id);
        return new ResponseEntity<>(ApiResponse.success("Fetched course", course), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseEntity>> updateCourse(
            @PathVariable("id") Integer id, 
            @Valid @RequestBody CourseEntity course) {
        CourseEntity updatedCourse = courseService.updateCourse(id, course);
        return new ResponseEntity<>(ApiResponse.success("Course updated successfully", updatedCourse), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable("id") Integer id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(ApiResponse.success("Course deleted successfully", null), HttpStatus.OK);
    }
}
