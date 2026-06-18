package com.example.sms.controller;

import com.example.sms.dto.ApiResponse;
import com.example.sms.dto.AuthResponse;
import com.example.sms.dto.LoginRequest;
import com.example.sms.dto.RegisterRequest;
import com.example.sms.entity.CourseEntity;
import com.example.sms.entity.RoleEntity;
import com.example.sms.entity.StudentEntity;
import com.example.sms.entity.UserEntity;
import com.example.sms.repository.RoleRepository;
import com.example.sms.repository.StudentRepository;
import com.example.sms.repository.UserRepository;
import com.example.sms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.sms.repository.CourseRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ─── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            UserEntity user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
            AuthResponse authResponse = new AuthResponse(jwt, user.getName(), user.getEmail(), role);
            return new ResponseEntity<>(ApiResponse.success("Login successful", authResponse), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Email or password is incorrect"), HttpStatus.UNAUTHORIZED);
        }
    }

    // ─── REGISTER ──────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest registerRequest) {
        String roleName = registerRequest.getRole().toUpperCase().equals("ADMIN") ? "ROLE_ADMIN" : "ROLE_STUDENT";

        if (roleName.equals("ROLE_STUDENT")) {
            if (registerRequest.getCourseId() == null) {
                return new ResponseEntity<>(ApiResponse.error("Course selection is mandatory for Students"), HttpStatus.BAD_REQUEST);
            }
            if (!courseRepository.existsById(registerRequest.getCourseId())) {
                return new ResponseEntity<>(ApiResponse.error("Selected course does not exist"), HttpStatus.BAD_REQUEST);
            }
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>(ApiResponse.error("Email is already taken"), HttpStatus.BAD_REQUEST);
        }

        // Create new user
        UserEntity user = new UserEntity();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        RoleEntity role = roleRepository.findByName(roleName).orElseGet(() -> {
            RoleEntity newRole = new RoleEntity();
            newRole.setName(roleName);
            return roleRepository.save(newRole);
        });

        user.getRoles().add(role);
        UserEntity savedUser = userRepository.save(user);

        // Create student profile if student role
        if (roleName.equals("ROLE_STUDENT")) {
            CourseEntity assignedCourse = courseRepository.findById(registerRequest.getCourseId()).get();
            StudentEntity student = new StudentEntity();
            student.setName(user.getName());
            student.setRoll((int) (Math.random() * 10000));
            student.setAddress("Please update");
            student.setCourse(assignedCourse);
            student.setUser(savedUser);
            studentRepository.save(student);
        }

        return new ResponseEntity<>(ApiResponse.success("Registration successful. You can now login.", null), HttpStatus.CREATED);
    }
}
