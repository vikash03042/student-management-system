package com.example.sms.controller;

import com.example.sms.entity.studEntity;
import com.example.sms.service.studService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/students")
public class studController {
    @Autowired
    private studService studservice;
@PostMapping
    public   studEntity add(@RequestBody  studEntity stud){
        return studservice.addStud(stud);
    }

    @GetMapping("/get")
    public   List<studEntity> getall(){
    return studservice.getAllStud();
    }
    @DeleteMapping("/{id}")
    public studEntity delete(@PathVariable ("id") Integer id){

    return studservice.deleteStud(id);
    }
    @GetMapping("/countAll")
    public Long countAll(){
    return studservice.count();
    }
    @PutMapping("/update/{id}")
public studEntity updateStud(@PathVariable ("id") Integer id ,@RequestBody studEntity stud){

return studservice.update(id,stud);
}

}
