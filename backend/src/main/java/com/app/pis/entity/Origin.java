package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "origin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Origin {

    @Id
    @Column(name = "originID", length = 50)
    private String originID;

    @Column(name = "originName", length = 100, unique = true, nullable = false)
    private String originName;
}
