package com.hospitalmanagement.backend.repository;

import com.hospitalmanagement.backend.model.PrescriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<PrescriptionEntity, UUID> {
    List<PrescriptionEntity> findByPatientId(String patientId);

    List<PrescriptionEntity> findByDoctorId(String doctorId);

    List<PrescriptionEntity> findByPatientName(String patientName);
}
