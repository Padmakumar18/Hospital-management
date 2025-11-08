package com.hospitalmanagement.backend.controller;

import com.hospitalmanagement.backend.model.PrescriptionEntity;
import com.hospitalmanagement.backend.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<PrescriptionEntity> createPrescription(@RequestBody PrescriptionEntity prescription) {
        try {
            PrescriptionEntity created = prescriptionService.createPrescription(prescription);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionEntity>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionEntity> getPrescriptionById(@PathVariable UUID id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionEntity>> getPrescriptionsByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionEntity>> getPrescriptionsByDoctorId(@PathVariable String doctorId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctorId(doctorId));
    }

    @GetMapping("/patient-name/{patientName}")
    public ResponseEntity<List<PrescriptionEntity>> getPrescriptionsByPatientName(@PathVariable String patientName) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientName(patientName));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionEntity> updatePrescription(
            @PathVariable UUID id,
            @RequestBody PrescriptionEntity prescription) {
        try {
            PrescriptionEntity updated = prescriptionService.updatePrescription(id, prescription);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable UUID id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
