package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_audit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"details"})
public class StockAudit {

    @Id
    @Column(name = "auditId", length = 50)
    private String auditId;

    @CreationTimestamp
    @Column(name = "auditTime", nullable = false, updatable = false)
    private LocalDateTime auditTime;

    /** Người lập phiếu kiểm kê */
    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private Employee createdBy;

    /** Người duyệt phiếu — nullable (chưa duyệt khi mới tạo) */
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AuditStatus status = AuditStatus.DRAFT;

    @OneToMany(mappedBy = "audit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockAuditDetail> details = new ArrayList<>();

    public enum AuditStatus {
        DRAFT, IN_PROGRESS, CONFIRMED, CANCELLED
    }
}