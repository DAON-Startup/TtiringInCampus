package api.domain.university.repository;

import api.domain.university.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversityRepository extends JpaRepository<University, Long> {
}
