package com.procucev.speech.controller;

import com.procucev.speech.entity.Transcription;
import com.procucev.speech.repository.TranscriptionRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/transcriptions")
public class TranscriptionController {

    private final TranscriptionRepository repository;

    public TranscriptionController(TranscriptionRepository repository) {
        this.repository = repository;
    }

    public record CreateTranscriptionRequest(
            @NotBlank @Size(max = 50) String language,
            @NotBlank String transcribedText
    ) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transcription create(
            @Valid @RequestBody CreateTranscriptionRequest request) {

        Transcription transcription = new Transcription(
                request.language().trim(),
                request.transcribedText().trim()
        );

        return repository.save(transcription);
    }

    @GetMapping
    public List<Transcription> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Transcription getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transcription not found"
                ));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Transcription not found"
            );
        }

        repository.deleteById(id);
    }
    @PutMapping("/{id}")
public ResponseEntity<Transcription> update(
        @PathVariable Long id,
        @Valid @RequestBody CreateTranscriptionRequest request) {

    Transcription transcription = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Transcription not found"
            ));

    transcription.setLanguage(request.language().trim());
    transcription.setTranscribedText(
            request.transcribedText().trim()
    );

    Transcription updated = repository.save(transcription);

    return ResponseEntity.ok(updated);
}
}
