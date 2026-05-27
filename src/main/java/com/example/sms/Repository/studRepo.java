package com.example.sms.Repository;

import com.example.sms.entity.studEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface studRepo extends JpaRepository<studEntity,Integer> {
//    Optional<studEntity> findById(Integer id);
    List<studEntity> findAll();

    studEntity save(studEntity stud);
    void deleteById(Integer id);
    long count();
//    studEntity updateById(Integer id);
}

