package com.app.pis.service;

import com.app.pis.dto.MedicineRequest;
import com.app.pis.dto.MedicineResponse;
import com.app.pis.dto.MedicineUnitRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.*;
import com.app.pis.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MedicineServiceTest {

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private MedicineUnitRepository medicineUnitRepository;

    @Mock
    private UnitRepository unitRepository;

    @Mock
    private CatalogRepository catalogRepository;

    @Mock
    private OriginRepository originRepository;

    @InjectMocks
    private MedicineService medicineService;

    private Medicine medicine;
    private Unit baseUnit;
    private Catalog catalog;
    private Origin origin;

    @BeforeEach
    void setUp() {
        baseUnit = new Unit();
        baseUnit.setUnitID("UNIT001");
        baseUnit.setUnitName("Viên");

        catalog = new Catalog();
        catalog.setCatalogID("CAT001");
        catalog.setCatalogName("Thuốc kháng sinh");

        origin = new Origin();
        origin.setOriginID("ORG001");
        origin.setOriginName("Việt Nam");

        medicine = new Medicine();
        medicine.setMedicineID("MED001");
        medicine.setMedicineName("Paracetamol 500mg");
        medicine.setImage("http://example.com/image.jpg");
        medicine.setIngredients("Paracetamol 500mg, tá dược vừa đủ");
        medicine.setBaseUnit(baseUnit);
        medicine.setCatalog(catalog);
        medicine.setOrigin(origin);
        medicine.setUnitPrice(new BigDecimal("1500.00"));
    }

    // =========================================================================
    // TESTS FOR GET ALL MEDICINES
    // =========================================================================

    @Test
    void testGetAll_NoSearch_ReturnsPagedResults() {
        List<Medicine> medicines = List.of(medicine);
        Page<Medicine> page = new PageImpl<>(medicines, PageRequest.of(0, 10), 1);

        when(medicineRepository.findAll(any(PageRequest.class))).thenReturn(page);
        when(medicineUnitRepository.findByMedicine(any(Medicine.class))).thenReturn(Collections.emptyList());

        PagedResponse<MedicineResponse> response = medicineService.getAll("", "", 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals("MED001", response.getItems().get(0).getMedicineID());
        assertEquals("Paracetamol 500mg", response.getItems().get(0).getMedicineName());
    }

    @Test
    void testGetAll_SearchByName_ReturnsFiltered() {
        List<Medicine> medicines = List.of(medicine);
        Page<Medicine> page = new PageImpl<>(medicines, PageRequest.of(0, 10), 1);

        when(medicineRepository.findByMedicineNameContainingIgnoreCase(eq("para"), any(PageRequest.class)))
                .thenReturn(page);
        when(medicineUnitRepository.findByMedicine(any(Medicine.class))).thenReturn(Collections.emptyList());

        PagedResponse<MedicineResponse> response = medicineService.getAll("para", "medicineName", 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        verify(medicineRepository).findByMedicineNameContainingIgnoreCase(eq("para"), any());
    }

    // =========================================================================
    // TESTS FOR GET BY ID
    // =========================================================================

    @Test
    void testGetById_Found() {
        when(medicineRepository.findById("MED001")).thenReturn(Optional.of(medicine));
        when(medicineUnitRepository.findByMedicine(medicine)).thenReturn(Collections.emptyList());

        MedicineResponse response = medicineService.getById("MED001");

        assertNotNull(response);
        assertEquals("MED001", response.getMedicineID());
        assertEquals("Paracetamol 500mg", response.getMedicineName());
    }

    @Test
    void testGetById_NotFound_ThrowsException() {
        when(medicineRepository.findById("NONEXISTENT")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.getById("NONEXISTENT");
        });
    }

    // =========================================================================
    // TESTS FOR CREATE MEDICINE
    // =========================================================================

    @Test
    void testCreate_Success() {
        MedicineRequest request = new MedicineRequest();
        request.setMedicineID("MED-NEW");
        request.setMedicineName("Amoxicillin 250mg");
        request.setImage("http://example.com/amox.jpg");
        request.setIngredients("Amoxicillin 250mg");
        request.setUnitPrice(new BigDecimal("2000.00"));
        request.setUnitID("UNIT001");
        request.setCatalogID("CAT001");
        request.setOriginID("ORG001");
        request.setAlternativeUnits(Collections.emptyList());

        when(medicineRepository.existsById("MED-NEW")).thenReturn(false);
        when(unitRepository.findById("UNIT001")).thenReturn(Optional.of(baseUnit));
        when(catalogRepository.findById("CAT001")).thenReturn(Optional.of(catalog));
        when(originRepository.findById("ORG001")).thenReturn(Optional.of(origin));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(inv -> inv.getArgument(0));

        MedicineResponse response = medicineService.create(request);

        assertNotNull(response);
        assertEquals("MED-NEW", response.getMedicineID());
        assertEquals("Amoxicillin 250mg", response.getMedicineName());
        verify(medicineRepository).save(any(Medicine.class));
    }

    @Test
    void testCreate_DuplicateID_ThrowsException() {
        MedicineRequest request = new MedicineRequest();
        request.setMedicineID("MED001");
        request.setMedicineName("Test");
        request.setIngredients("Test");
        request.setUnitPrice(new BigDecimal("1000"));
        request.setUnitID("UNIT001");
        request.setCatalogID("CAT001");
        request.setOriginID("ORG001");

        when(medicineRepository.existsById("MED001")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.create(request);
        });

        verify(medicineRepository, never()).save(any());
    }

    @Test
    void testCreate_EmptyMedicineID_ThrowsException() {
        MedicineRequest request = new MedicineRequest();
        request.setMedicineID("");
        request.setMedicineName("Test");

        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.create(request);
        });
    }

    @Test
    void testCreate_WithAlternativeUnits_Success() {
        Unit altUnit = new Unit();
        altUnit.setUnitID("UNIT002");
        altUnit.setUnitName("Hộp");

        MedicineUnitRequest altRequest = new MedicineUnitRequest();
        altRequest.setUnitID("UNIT002");
        altRequest.setConversionRate(10);

        MedicineRequest request = new MedicineRequest();
        request.setMedicineID("MED-ALT");
        request.setMedicineName("Thuốc quy đổi");
        request.setIngredients("Thành phần test");
        request.setUnitPrice(new BigDecimal("5000"));
        request.setUnitID("UNIT001");
        request.setCatalogID("CAT001");
        request.setOriginID("ORG001");
        request.setAlternativeUnits(List.of(altRequest));

        when(medicineRepository.existsById("MED-ALT")).thenReturn(false);
        when(unitRepository.findById("UNIT001")).thenReturn(Optional.of(baseUnit));
        when(unitRepository.findById("UNIT002")).thenReturn(Optional.of(altUnit));
        when(catalogRepository.findById("CAT001")).thenReturn(Optional.of(catalog));
        when(originRepository.findById("ORG001")).thenReturn(Optional.of(origin));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(inv -> inv.getArgument(0));
        when(medicineUnitRepository.save(any(MedicineUnit.class))).thenAnswer(inv -> inv.getArgument(0));

        MedicineResponse response = medicineService.create(request);

        assertNotNull(response);
        verify(medicineUnitRepository).save(any(MedicineUnit.class));
    }

    @Test
    void testCreate_AltUnitSameAsBase_ThrowsException() {
        MedicineUnitRequest altRequest = new MedicineUnitRequest();
        altRequest.setUnitID("UNIT001"); // Same as base unit
        altRequest.setConversionRate(10);

        MedicineRequest request = new MedicineRequest();
        request.setMedicineID("MED-DUP");
        request.setMedicineName("Test Dup");
        request.setIngredients("Test");
        request.setUnitPrice(new BigDecimal("1000"));
        request.setUnitID("UNIT001");
        request.setCatalogID("CAT001");
        request.setOriginID("ORG001");
        request.setAlternativeUnits(List.of(altRequest));

        when(medicineRepository.existsById("MED-DUP")).thenReturn(false);
        when(unitRepository.findById("UNIT001")).thenReturn(Optional.of(baseUnit));
        when(catalogRepository.findById("CAT001")).thenReturn(Optional.of(catalog));
        when(originRepository.findById("ORG001")).thenReturn(Optional.of(origin));
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(inv -> inv.getArgument(0));

        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.create(request);
        });
    }

    // =========================================================================
    // TESTS FOR DELETE MEDICINE
    // =========================================================================

    @Test
    void testDelete_Success() {
        when(medicineRepository.findById("MED001")).thenReturn(Optional.of(medicine));
        doNothing().when(medicineUnitRepository).deleteByMedicine(medicine);
        doNothing().when(medicineRepository).delete(medicine);

        assertDoesNotThrow(() -> {
            medicineService.delete("MED001");
        });

        verify(medicineUnitRepository).deleteByMedicine(medicine);
        verify(medicineRepository).delete(medicine);
    }

    @Test
    void testDelete_NotFound_ThrowsException() {
        when(medicineRepository.findById("NONEXISTENT")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            medicineService.delete("NONEXISTENT");
        });
    }
}
