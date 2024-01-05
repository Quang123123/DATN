package com.fado.watch.repository;

import com.fado.watch.entity.Origin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OriginRepository extends JpaRepository<Origin, Integer> {

    Optional<Origin> findByName(String name);

    @Query("SELECT o.id FROM origins o")
    Integer[] getAllIdOrigin();
}