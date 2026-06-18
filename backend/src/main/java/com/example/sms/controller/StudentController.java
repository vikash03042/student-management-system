package com.example.sms.controller;

import com.example.sms.dto.ApiResponse;
import com.example.sms.entity.StudentEntity;
import com.example.sms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/students")
@CrossOrigin("*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<StudentEntity>> add(@Valid @RequestBody StudentEntity student) {
        StudentEntity savedStudent = studentService.addStudent(student);
        return new ResponseEntity<>(ApiResponse.success("Student added successfully", savedStudent), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentEntity>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        Page<StudentEntity> students = studentService.getAllStudents(search, page, size, sortField, sortDir);
        return new ResponseEntity<>(ApiResponse.success("Fetched students successfully", students), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentEntity>> getById(@PathVariable("id") Integer id) {
        StudentEntity student = studentService.getStudentById(id);
        return new ResponseEntity<>(ApiResponse.success("Fetched student", student), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") Integer id) {
        studentService.deleteStudent(id);
        return new ResponseEntity<>(ApiResponse.success("Student deleted successfully", null), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentEntity>> update(
            @PathVariable("id") Integer id,
            @Valid @RequestBody StudentEntity student) {
        StudentEntity updatedStudent = studentService.updateStudent(id, student);
        return new ResponseEntity<>(ApiResponse.success("Student updated successfully", updatedStudent), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countAll() {
        return new ResponseEntity<>(ApiResponse.success("Total count fetched", studentService.countAll()), HttpStatus.OK);
    }
}
