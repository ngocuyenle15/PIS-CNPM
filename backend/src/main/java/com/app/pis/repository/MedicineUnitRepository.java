package com.app.pis.repository;

import com.app.pis.entity.Medicine;
import com.app.pis.entity.MedicineUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineUnitRepository extends JpaRepository<MedicineUnit, Integer> {
    List<MedicineUnit> findByMedicine(Medicine medicine);
    void deleteByMedicine(Medicine medicine);
}
