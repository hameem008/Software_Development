package com.example.MediLine.Service.Doctor;

import com.example.MediLine.Repository.AppointmentRepository;
import com.example.MediLine.Repository.PerformedTestRepository;
import com.example.MediLine.Repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorAuthorizationService {
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final PerformedTestRepository performedTestRepository;


    public void checkDoctorsAccessToPatient(Integer doctorId, Integer patientId) {
        boolean accessViaPrescription = prescriptionRepository
                .existsByDoctorAndPatient(doctorId, patientId);
        boolean accessViaAppointment = appointmentRepository
                .existsByDoctorAndPatient(doctorId, patientId);

        if(!accessViaPrescription && !accessViaAppointment){
            throw new IllegalArgumentException("Doctor is not authorized for this patient.");
        };
    }

    public void checkDoctorsAccessToPrescription(Integer doctorId, Integer prescriptionId){
        if(!prescriptionRepository.doctorIsAuthorized(prescriptionId, doctorId)) {
            throw new IllegalArgumentException("Doctor is not authorized for this patient.");
        }
    }

    public void checkDoctorsAccessToTestResult(Integer doctorId, Integer performedTestId){
        if(!performedTestRepository.doctorIsAuthorized(doctorId, performedTestId)) {
            throw new IllegalArgumentException("Doctor is not authorized for this patient.");
        }
    }
}
