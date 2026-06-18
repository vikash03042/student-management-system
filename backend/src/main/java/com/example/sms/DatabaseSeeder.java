package com.example.sms;

import com.example.sms.entity.CourseEntity;
import com.example.sms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            courseRepository.save(new CourseEntity(null, "B.Tech Computer Science", "4 Years", 5000.0, "Learn programming and software engineering.", null));
            courseRepository.save(new CourseEntity(null, "B.Tech Mechanical", "4 Years", 4500.0, "Learn mechanics, thermodynamics, and manufacturing.", null));
            courseRepository.save(new CourseEntity(null, "BBA Business Administration", "3 Years", 3000.0, "Learn business management and economics.", null));
            System.out.println("Seeded 3 default courses into the database!");
        }
    }
}
