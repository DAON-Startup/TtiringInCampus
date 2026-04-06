package api.domain.university.repository;

import api.domain.university.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByUniversity_UniversityId(Long universityId);
}
