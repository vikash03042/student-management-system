package com.example.sms.service;

import com.example.sms.entity.StudentEntity;
import java.util.List;

import org.springframework.data.domain.Page;

public interface StudentService {
    StudentEntity addStudent(StudentEntity student);
    Page<StudentEntity> getAllStudents(String search, int page, int size, String sortField, String sortDirection);
    StudentEntity getStudentById(Integer id);
    void deleteStudent(Integer id);
    StudentEntity updateStudent(Integer id, StudentEntity student);
    Long countAll();
}
