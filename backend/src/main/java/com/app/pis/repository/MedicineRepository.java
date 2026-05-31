package com.app.pis.repository;

import com.app.pis.entity.Catalog;
import com.app.pis.entity.Medicine;
import com.app.pis.entity.Origin;
import com.app.pis.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {
    boolean existsByBaseUnit(Unit baseUnit);
    boolean existsByCatalog(Catalog catalog);
    boolean existsByOrigin(Origin origin);

    Page<Medicine> findByMedicineNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Medicine> findByMedicineIDContainingIgnoreCase(String id, Pageable pageable);
    Page<Medicine> findByIngredientsContainingIgnoreCase(String ingredients, Pageable pageable);
    Page<Medicine> findByCatalogCatalogNameContainingIgnoreCase(String catalogName, Pageable pageable);
    Page<Medicine> findByOriginOriginNameContainingIgnoreCase(String originName, Pageable pageable);
}
