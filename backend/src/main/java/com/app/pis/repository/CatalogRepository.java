package com.app.pis.repository;

import com.app.pis.entity.Catalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CatalogRepository extends JpaRepository<Catalog, String> {
    Optional<Catalog> findByCatalogName(String catalogName);
    boolean existsByCatalogName(String catalogName);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Catalog c WHERE LOWER(c.catalogID) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.catalogName) LIKE LOWER(CONCAT('%', :search, '%'))")
    org.springframework.data.domain.Page<Catalog> findBySearch(String search, org.springframework.data.domain.Pageable pageable);
}
