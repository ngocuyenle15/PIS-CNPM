package com.app.pis.repository;

import com.app.pis.entity.Origin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OriginRepository extends JpaRepository<Origin, String> {
    Optional<Origin> findByOriginName(String originName);
    boolean existsByOriginName(String originName);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Origin o WHERE LOWER(o.originID) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.originName) LIKE LOWER(CONCAT('%', :search, '%'))")
    org.springframework.data.domain.Page<Origin> findBySearch(String search, org.springframework.data.domain.Pageable pageable);
}
