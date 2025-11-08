package com.hospitalmanagement.backend.repository;

import com.hospitalmanagement.backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    List<Department> findByActiveTrue();

    Department findByName(String name);
}
