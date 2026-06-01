package com.app.pis.repository;

import com.app.pis.entity.Medicine;
import com.app.pis.entity.MedicineUnit;
import com.app.pis.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineUnitRepository extends JpaRepository<MedicineUnit, Integer> {
    List<MedicineUnit> findByMedicine(Medicine medicine);
    void deleteByMedicine(Medicine medicine);
    Optional<MedicineUnit> findByMedicineAndUnit(Medicine medicine, Unit unit);
}

