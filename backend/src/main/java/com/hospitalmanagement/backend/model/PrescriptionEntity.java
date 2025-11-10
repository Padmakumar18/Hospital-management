package com.hospitalmanagement.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "prescriptions")
public class PrescriptionEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "doctor_id")
    private String doctorId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "age")
    private int age;

    @Column(name = "diagnosis", length = 1000)
    private String diagnosis;

    @Column(name = "symptoms", length = 1000)
    private String symptoms;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Medicine> medicines = new ArrayList<>();

    @Column(name = "additional_notes", length = 1000)
    private String additionalNotes;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "dispensed_status")
    private String dispensedStatus = "Pending";

    @Column(name = "dispensed_date")
    private LocalDate dispensedDate;

    @Column(name = "dispensed_by")
    private String dispensedBy;

    @Column(name = "is_edited")
    private Boolean isEdited = false;

    @Column(name = "last_edited_date")
    private LocalDate lastEditedDate;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public List<Medicine> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<Medicine> medicines) {
        this.medicines = medicines;
        for (Medicine medicine : medicines) {
            medicine.setPrescription(this);
        }
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDate followUpDate) {
        this.followUpDate = followUpDate;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getDispensedStatus() {
        return dispensedStatus;
    }

    public void setDispensedStatus(String dispensedStatus) {
        this.dispensedStatus = dispensedStatus;
    }

    public LocalDate getDispensedDate() {
        return dispensedDate;
    }

    public void setDispensedDate(LocalDate dispensedDate) {
        this.dispensedDate = dispensedDate;
    }

    public String getDispensedBy() {
        return dispensedBy;
    }

    public void setDispensedBy(String dispensedBy) {
        this.dispensedBy = dispensedBy;
    }

    public Boolean getEdited() {
        return isEdited != null ? isEdited : false;
    }

    public void setEdited(Boolean edited) {
        isEdited = edited;
    }

    public LocalDate getLastEditedDate() {
        return lastEditedDate;
    }

    public void setLastEditedDate(LocalDate lastEditedDate) {
        this.lastEditedDate = lastEditedDate;
    }
}
