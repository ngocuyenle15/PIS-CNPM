package com.app.pis.integration;

import com.app.pis.dto.CatalogRequest;
import com.app.pis.repository.CatalogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CatalogControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = {"Admin"})
    void testCreateCatalog_Success() throws Exception {
        CatalogRequest request = new CatalogRequest();
        request.setCatalogID("CAT-TEST-IT");
        request.setCatalogName("Danh mục kiểm thử tích hợp");

        mockMvc.perform(post("/api/catalogs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(200)))
                .andExpect(jsonPath("$.data.catalogID", is("CAT-TEST-IT")))
                .andExpect(jsonPath("$.data.catalogName", is("Danh mục kiểm thử tích hợp")));

        assertTrue(catalogRepository.existsById("CAT-TEST-IT"));
    }

    @Test
    @WithMockUser(username = "sales", roles = {"Sales"})
    void testCreateCatalog_ForbiddenForSales() throws Exception {
        CatalogRequest request = new CatalogRequest();
        request.setCatalogID("CAT-TEST-FAIL");
        request.setCatalogName("Danh mục thất bại");

        mockMvc.perform(post("/api/catalogs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is(403)))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Bạn không có quyền truy cập tài nguyên này")));
    }
}
