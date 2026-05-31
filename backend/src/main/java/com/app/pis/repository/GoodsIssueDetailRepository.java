package com.app.pis.repository;

import com.app.pis.entity.GoodsIssueDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsIssueDetailRepository extends JpaRepository<GoodsIssueDetail, Long> {
    List<GoodsIssueDetail> findByIssueIssueId(String issueId);
}
