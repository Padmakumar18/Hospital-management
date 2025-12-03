package com.hospitalmanagement.backend.service;

import com.hospitalmanagement.backend.model.Department;
import com.hospitalmanagement.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findByActiveTrue();
    }

    public Optional<Department> getDepartmentById(UUID id) {
        return departmentRepository.findById(id);
    }

    public Department getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }

    public Department updateDepartment(UUID id, Department departmentDetails) {
        Optional<Department> department = departmentRepository.findById(id);
        if (department.isPresent()) {
            Department existingDepartment = department.get();
            existingDepartment.setName(departmentDetails.getName());
            existingDepartment.setDescription(departmentDetails.getDescription());
            existingDepartment.setActive(departmentDetails.isActive());
            return departmentRepository.save(existingDepartment);
        }
        throw new RuntimeException("Department not found with id: " + id);
    }

    public void deleteDepartment(UUID id) {
        departmentRepository.deleteById(id);
    }
}
