package com.example.sms.service;

import com.example.sms.entity.studEntity;

import java.util.List;


public interface studService {

    studEntity addStud(studEntity stud);
    List<studEntity> getAllStud();
   studEntity deleteStud(Integer id);
Long count();
studEntity update(Integer id ,studEntity stud);

}
