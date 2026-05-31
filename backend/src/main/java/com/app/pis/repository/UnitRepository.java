package com.app.pis.repository;

import com.app.pis.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, String> {
    Optional<Unit> findByUnitName(String unitName);
    boolean existsByUnitName(String unitName);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM Unit u WHERE LOWER(u.unitID) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.unitName) LIKE LOWER(CONCAT('%', :search, '%'))")
    org.springframework.data.domain.Page<Unit> findBySearch(String search, org.springframework.data.domain.Pageable pageable);
}
