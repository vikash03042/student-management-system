package com.example.sms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Course name is required")
    @Column(nullable = false, unique = true)
    private String courseName;

    @NotBlank(message = "Duration is required")
    @Column(nullable = false)
    private String duration; // e.g., "4 Years"

    @NotNull(message = "Fees are required")
    @Min(value = 0, message = "Fees cannot be negative")
    @Column(nullable = false)
    private Double fees;

    @Column(length = 500)
    private String description;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<StudentEntity> students;
}
