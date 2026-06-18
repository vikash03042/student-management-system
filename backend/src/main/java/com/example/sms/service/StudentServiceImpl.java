package com.example.sms.service;

import com.example.sms.entity.StudentEntity;
import com.example.sms.exception.DuplicateRollNumberException;
import com.example.sms.exception.StudentNotFoundException;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public StudentEntity addStudent(StudentEntity student) {
        if (studentRepository.existsByRoll(student.getRoll())) {
            throw new DuplicateRollNumberException("Student with roll number " + student.getRoll() + " already exists.");
        }
        return studentRepository.save(student);
    }

    @Override
    public Page<StudentEntity> getAllStudents(String search, int page, int size, String sortField, String sortDirection) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortField).ascending() 
                    : Sort.by(sortField).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (!isAdmin) {
            return studentRepository.findByUser_Email(auth.getName(), pageable);
        }

        if (search != null && !search.trim().isEmpty()) {
            return studentRepository.searchAllFields(search, pageable);
        }
        
        return studentRepository.findAll(pageable);
    }

    @Override
    public StudentEntity getStudentById(Integer id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin && (student.getUser() == null || !student.getUser().getEmail().equals(auth.getName()))) {
            throw new AccessDeniedException("You are not allowed to access this profile.");
        }
        
        return student;
    }

    @Override
    public void deleteStudent(Integer id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public StudentEntity updateStudent(Integer id, StudentEntity updatedStudent) {
        StudentEntity existingStudent = getStudentById(id); // getStudentById already has auth check

        if (studentRepository.existsByRollAndIdNot(updatedStudent.getRoll(), id)) {
            throw new DuplicateRollNumberException("Student with roll number " + updatedStudent.getRoll() + " already exists.");
        }

        existingStudent.setName(updatedStudent.getName());
        existingStudent.setRoll(updatedStudent.getRoll());
        existingStudent.setAddress(updatedStudent.getAddress());
        existingStudent.setCourse(updatedStudent.getCourse());

        return studentRepository.save(existingStudent);
    }

    @Override
    public Long countAll() {
        return studentRepository.count();
    }
}
