package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Doctor;
import com.hospitalmanagement.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailableTrue();
    }

    public List<Doctor> getDoctorsByDepartment(String department) {
        return doctorRepository.findByDepartment(department);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public Optional<Doctor> getDoctorById(UUID id) {
        return doctorRepository.findById(id);
    }

    public Doctor getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    public Doctor updateDoctor(UUID id, Doctor doctorDetails) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            Doctor existingDoctor = doctor.get();
            existingDoctor.setName(doctorDetails.getName());
            existingDoctor.setEmail(doctorDetails.getEmail());
            existingDoctor.setSpecialization(doctorDetails.getSpecialization());
            existingDoctor.setDepartment(doctorDetails.getDepartment());
            existingDoctor.setPhone(doctorDetails.getPhone());
            existingDoctor.setAvailable(doctorDetails.isAvailable());
            existingDoctor.setExperienceYears(doctorDetails.getExperienceYears());
            existingDoctor.setQualification(doctorDetails.getQualification());
            return doctorRepository.save(existingDoctor);
        }
        throw new RuntimeException("Doctor not found with id: " + id);
    }

    public void deleteDoctor(UUID id) {
        doctorRepository.deleteById(id);
    }
}
