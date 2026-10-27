package com.procucev.speech.repository;

import com.procucev.speech.entity.Transcription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranscriptionRepository
        extends JpaRepository<Transcription, Long> {
}
