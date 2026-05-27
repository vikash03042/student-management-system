package com.example.sms.service;

import com.example.sms.Repository.studRepo;
import com.example.sms.entity.studEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class studServiceImpl implements studService{
    @Autowired
    private studRepo repo;
    @Override
    public studEntity addStud(studEntity stud) {
        return repo.save(stud);
    }

    @Override
    public List<studEntity> getAllStud() {
        return repo.findAll();
    }

    @Override
    public studEntity deleteStud(Integer id) {
repo.deleteById(id);
        return null;
    }

    @Override
    public Long count() {
        return repo.count();
    }

    @Override
    public studEntity update(Integer id, studEntity stud) {

        studEntity oldStud= repo.findById(id).orElseThrow( ()-> new RuntimeException("Student Not Found!"));
        oldStud.setName(stud.getName());
        oldStud.setRoll(stud.getRoll());
        oldStud.setAddress(stud.getAddress());
        oldStud.setCourse(stud.getCourse());
        return repo.save(oldStud);
    }




}
