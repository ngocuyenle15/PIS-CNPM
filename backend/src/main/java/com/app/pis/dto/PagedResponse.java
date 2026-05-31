package com.app.pis.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    private List<T> items;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;
}
