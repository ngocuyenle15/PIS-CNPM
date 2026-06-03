package com.app.pis.service;

import com.app.pis.dto.CustomerRequest;
import com.app.pis.entity.Customer;
import com.app.pis.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setCustomerID("CUST-01");
        customer.setFullName("Lê Thị C");
        customer.setPhoneNumber("0981112223");
        customer.setGender(Customer.Gender.Female);
    }

    @Test
    void testGetAll_Success() {
        when(customerRepository.findAll()).thenReturn(Collections.singletonList(customer));

        List<Customer> result = customerService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CUST-01", result.get(0).getCustomerID());
    }

    @Test
    void testGetById_Found() {
        when(customerRepository.findById("CUST-01")).thenReturn(Optional.of(customer));

        Customer result = customerService.getById("CUST-01");

        assertNotNull(result);
        assertEquals("Lê Thị C", result.getFullName());
    }

    @Test
    void testGetById_NotFound_ThrowsException() {
        when(customerRepository.findById("NONEXISTENT")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            customerService.getById("NONEXISTENT");
        });
    }

    @Test
    void testCreate_Success() {
        CustomerRequest request = new CustomerRequest();
        request.setCustomerID("CUST-NEW");
        request.setFullName("Nguyễn Văn B");
        request.setPhoneNumber("0987778889");
        request.setGender(Customer.Gender.Male);

        when(customerRepository.existsById("CUST-NEW")).thenReturn(false);
        when(customerRepository.existsByPhoneNumber("0987778889")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        Customer created = customerService.create(request);

        assertNotNull(created);
        assertEquals("CUST-NEW", created.getCustomerID());
        assertEquals("Nguyễn Văn B", created.getFullName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void testCreate_DuplicateID_ThrowsException() {
        CustomerRequest request = new CustomerRequest();
        request.setCustomerID("CUST-01");
        request.setFullName("Duplicate");
        request.setPhoneNumber("0981112223");
        request.setGender(Customer.Gender.Male);

        when(customerRepository.existsById("CUST-01")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            customerService.create(request);
        });
    }

    @Test
    void testPatch_Success() {
        CustomerRequest request = new CustomerRequest();
        request.setFullName("Lê Thị C Cập Nhật");
        request.setPhoneNumber("0982223334");

        when(customerRepository.findById("CUST-01")).thenReturn(Optional.of(customer));
        when(customerRepository.existsByPhoneNumber("0982223334")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        Customer patched = customerService.patch("CUST-01", request);

        assertNotNull(patched);
        assertEquals("Lê Thị C Cập Nhật", patched.getFullName());
        assertEquals("0982223334", patched.getPhoneNumber());
        verify(customerRepository).save(customer);
    }

    @Test
    void testDelete_Success() {
        when(customerRepository.findById("CUST-01")).thenReturn(Optional.of(customer));
        doNothing().when(customerRepository).delete(customer);

        assertDoesNotThrow(() -> {
            customerService.delete("CUST-01");
        });

        verify(customerRepository).delete(customer);
    }

    @Test
    void testDelete_ForeignKeyViolation_ThrowsException() {
        when(customerRepository.findById("CUST-01")).thenReturn(Optional.of(customer));
        doThrow(DataIntegrityViolationException.class).when(customerRepository).delete(customer);

        assertThrows(IllegalArgumentException.class, () -> {
            customerService.delete("CUST-01");
        });
    }
}
