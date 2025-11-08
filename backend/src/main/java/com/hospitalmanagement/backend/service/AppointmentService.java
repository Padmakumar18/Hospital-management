package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Appointment;
import com.hospitalmanagement.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("Scheduled");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(UUID id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    public Appointment updateAppointment(UUID id, Appointment appointmentDetails) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment existingAppointment = appointment.get();
            existingAppointment.setStatus(appointmentDetails.getStatus());
            existingAppointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            existingAppointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
            existingAppointment.setReason(appointmentDetails.getReason());
            existingAppointment.setPrescriptionGiven(appointmentDetails.isPrescriptionGiven());
            existingAppointment.setFollowUpRequired(appointmentDetails.isFollowUpRequired());
            existingAppointment.setFollowUpDate(appointmentDetails.getFollowUpDate());
            existingAppointment.setCancellationReason(appointmentDetails.getCancellationReason());
            return appointmentRepository.save(existingAppointment);
        }
        throw new RuntimeException("Appointment not found with id: " + id);
    }

    public void deleteAppointment(UUID id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateAppointmentStatus(UUID id, String status, String cancellationReason) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment existingAppointment = appointment.get();
            existingAppointment.setStatus(status);
            if (cancellationReason != null) {
                existingAppointment.setCancellationReason(cancellationReason);
            }
            return appointmentRepository.save(existingAppointment);
        }
        throw new RuntimeException("Appointment not found with id: " + id);
    }
}
