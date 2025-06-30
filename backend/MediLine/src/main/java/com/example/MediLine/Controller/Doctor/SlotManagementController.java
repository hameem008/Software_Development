package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.DTO.DoctorSlotDTO.AddSlotRequest;
import com.example.MediLine.DTO.DoctorSlotDTO.DeleteSlotRequest;
import com.example.MediLine.DTO.DoctorSlotDTO.DoctorSlotDTO;
import com.example.MediLine.DTO.DoctorSlotDTO.EditSlotRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/slots")
@RequiredArgsConstructor
public class SlotManagementController {

    @GetMapping("")
    public ResponseEntity<List<DoctorSlotDTO>> getDoctorSlots() {

       return null;
    }

    @PostMapping("/edit")
    public ResponseEntity<List<DoctorSlotDTO>> editSlot(
            @RequestBody @Valid
            EditSlotRequest editSlotRequest) {

       return null;
    }

    @PutMapping("/add")
    public ResponseEntity<List<DoctorSlotDTO>> addSlot(
            @RequestBody @Valid
            AddSlotRequest addSlotRequest) {

       return null;
    }

    @PutMapping("/delete")
    public ResponseEntity<List<DoctorSlotDTO>> deleteSlot(
            @RequestBody @Valid
            DeleteSlotRequest deleteSlotRequest) {

       return null;
    }
}
