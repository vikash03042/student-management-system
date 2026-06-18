package com.example.sms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Roll number is required")
    @Min(value = 1, message = "Roll number must be greater than 0")
    @Max(value = 99999, message = "Roll number is too large")
    private Integer roll;

    @NotBlank(message = "Address is required")
    private String address;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
}
