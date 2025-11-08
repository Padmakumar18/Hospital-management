package com.hospitalmanagement.backend.repository;

import com.hospitalmanagement.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByPatientIdAndStatus(String patientId, String status);

    List<Appointment> findByDoctorIdAndStatus(String doctorId, String status);
}
