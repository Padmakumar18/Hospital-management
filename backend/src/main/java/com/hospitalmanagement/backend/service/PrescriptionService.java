package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Medicine;
import com.hospitalmanagement.backend.model.PrescriptionEntity;
import com.hospitalmanagement.backend.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public PrescriptionEntity createPrescription(PrescriptionEntity prescription) {
        prescription.setCreatedDate(LocalDate.now());

        // Set bidirectional relationship for medicines
        if (prescription.getMedicines() != null) {
            for (Medicine medicine : prescription.getMedicines()) {
                medicine.setPrescription(prescription);
            }
        }

        return prescriptionRepository.save(prescription);
    }

    public List<PrescriptionEntity> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<PrescriptionEntity> getPrescriptionById(UUID id) {
        return prescriptionRepository.findById(id);
    }

    public List<PrescriptionEntity> getPrescriptionsByPatientId(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<PrescriptionEntity> getPrescriptionsByDoctorId(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<PrescriptionEntity> getPrescriptionsByPatientName(String patientName) {
        return prescriptionRepository.findByPatientName(patientName);
    }

    public PrescriptionEntity updatePrescription(UUID id, PrescriptionEntity prescriptionDetails) {
        Optional<PrescriptionEntity> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            PrescriptionEntity existingPrescription = prescription.get();
            existingPrescription.setDiagnosis(prescriptionDetails.getDiagnosis());
            existingPrescription.setSymptoms(prescriptionDetails.getSymptoms());
            existingPrescription.setAdditionalNotes(prescriptionDetails.getAdditionalNotes());
            existingPrescription.setFollowUpDate(prescriptionDetails.getFollowUpDate());

            // Mark as edited
            existingPrescription.setEdited(true);
            existingPrescription.setLastEditedDate(LocalDate.now());

            // Update medicines
            existingPrescription.getMedicines().clear();
            if (prescriptionDetails.getMedicines() != null) {
                for (Medicine medicine : prescriptionDetails.getMedicines()) {
                    medicine.setPrescription(existingPrescription);
                    existingPrescription.getMedicines().add(medicine);
                }
            }

            return prescriptionRepository.save(existingPrescription);
        }
        throw new RuntimeException("Prescription not found with id: " + id);
    }

    public PrescriptionEntity dispensePrescription(UUID id, String pharmacistName) {
        Optional<PrescriptionEntity> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            PrescriptionEntity existingPrescription = prescription.get();
            existingPrescription.setDispensedStatus("Dispensed");
            existingPrescription.setDispensedDate(LocalDate.now());
            existingPrescription.setDispensedBy(pharmacistName);
            return prescriptionRepository.save(existingPrescription);
        }
        throw new RuntimeException("Prescription not found with id: " + id);
    }

    public void deletePrescription(UUID id) {
        prescriptionRepository.deleteById(id);
    }
}
