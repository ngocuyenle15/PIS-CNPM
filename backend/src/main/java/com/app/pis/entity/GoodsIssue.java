package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goods_issue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"details"})
public class GoodsIssue {

    @Id
    @Column(name = "issueId", length = 50)
    private String issueId;

    @CreationTimestamp
    @Column(name = "issueTime", nullable = false, updatable = false)
    private LocalDateTime issueTime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "issueType", nullable = false, length = 30)
    private IssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private IssueStatus status = IssueStatus.DRAFT;

    /** nullable — chỉ có giá trị khi issueType = SALE */
//    @ManyToOne
//    @JoinColumn(name = "invoice_id")
//    private Invoice invoice;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GoodsIssueDetail> details = new ArrayList<>();

    public enum IssueType {
        SALE, EXPIRED, DAMAGED, RETURN_SUPPLIER, OTHER
    }

    public enum IssueStatus {
        DRAFT, CONFIRMED, CANCELLED
    }
}