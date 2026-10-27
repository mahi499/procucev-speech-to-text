import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/transcriptions";

const LANGUAGES = [
  { label: "English (US)", value: "en-US" },
  { label: "English (India)", value: "en-IN" },
  { label: "Hindi", value: "hi-IN" },
  { label: "Telugu", value: "te-IN" },
  { label: "Kannada", value: "kn-IN" },
  { label: "Tamil", value: "ta-IN" },
  { label: "Spanish", value: "es-ES" },
  { label: "French", value: "fr-FR" },
];

function App() {
  const [language, setLanguage] = useState("en-IN");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editLanguage, setEditLanguage] = useState("");
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("All");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(
        "Speech recognition is not supported in this browser. Please try Chrome."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setListening(true);
        setMessage("Listening... Speak into your microphone.");
      };

      recognition.onresult = (event) => {
        let recognizedText = "";
        for (let i = 0; i < event.results.length; i += 1) {
          recognizedText += event.results[i][0].transcript;
          if (event.results[i].isFinal) recognizedText += " ";
        }
        setTranscript(recognizedText.trimStart());
      };

      recognition.onerror = (event) => {
        setMessage(`Speech recognition error: ${event.error}`);
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      window.currentRecognition = recognition;
      recognition.start();
    } catch (error) {
      setListening(false);
      setMessage(`Could not start recording: ${error.message}`);
    }
  };

  const stopListening = () => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }
    setListening(false);
    setMessage("Recording stopped.");
  };

  const clearTranscript = () => {
    setTranscript("");
    setMessage("");
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading transcription history:", error);
      setMessage(`Unable to load history: ${error.message}`);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveTranscript = async () => {
    if (!transcript.trim()) {
      setMessage("Please record or type some speech before saving.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: LANGUAGES.find((item) => item.value === language)?.label || language,
          transcribedText: transcript.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      setMessage("Transcription saved successfully!");
      setTranscript("");
      await fetchHistory();
    } catch (error) {
      setMessage(`Could not save transcription: ${error.message}`);
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setEditLanguage(item.language || "");
    setEditText(item.transcribedText || "");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLanguage("");
    setEditText("");
  };

  const updateTranscription = async (id) => {
    if (!editLanguage.trim() || !editText.trim()) {
      setMessage("Language and transcription text cannot be empty.");
      return;
    }

    setBusyId(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: editLanguage.trim(),
          transcribedText: editText.trim(),
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Server returned ${response.status}`);
      }

      setMessage("Transcription updated successfully.");
      cancelEdit();
      await fetchHistory();
    } catch (error) {
      setMessage(`Could not update transcription: ${error.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const deleteTranscription = async (item) => {
    const confirmed = window.confirm(
      `Delete this ${item.language || ""} transcription? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyId(item.id);
    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Server returned ${response.status}`);
      }

      if (editingId === item.id) cancelEdit();
      setMessage("Transcription deleted successfully.");
      await fetchHistory();
    } catch (error) {
      setMessage(`Could not delete transcription: ${error.message}`);
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const languageOptions = [...new Set(history.map((item) => item.language).filter(Boolean))];
  const visibleHistory = history.filter((item) => {
    const textMatches = `${item.language || ""} ${item.transcribedText || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const languageMatches =
      filterLanguage === "All" || item.language === filterLanguage;
    return textMatches && languageMatches;
  });

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">✦</span>
          <span>Procucev<span className="brand-ai"> AI</span></span>
        </a>
        <span className="header-label">SPEECH INTELLIGENCE</span>
      </header>

      <main className="main-content">
        <section className="hero">
          <span className="eyebrow">AI-POWERED SPEECH RECOGNITION</span>
          <h1>Your voice,<br /><span>translated into text.</span></h1>
          <p>
            Speak naturally. Capture your ideas. Turn conversations into
            searchable text in your preferred language.
          </p>
        </section>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <span className="section-number">01 / TRANSCRIBE</span>
              <h2>Speech workspace</h2>
            </div>
            <span className={`status ${listening ? "status-live" : ""}`}>
              <span className="status-dot" />
              {listening ? "Listening live" : "Ready"}
            </span>
          </div>

          <div className="controls">
            <label htmlFor="language">Recognition language</label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              disabled={listening}
            >
              {LANGUAGES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="record-area">
            <button
              type="button"
              className={`record-button ${listening ? "recording" : ""}`}
              onClick={listening ? stopListening : startListening}
              aria-label={listening ? "Stop recording" : "Start recording"}
            >
              <span className="mic-icon">{listening ? "■" : "🎙"}</span>
            </button>
            <h3>{listening ? "I'm listening..." : "Ready when you are"}</h3>
            <p>
              {listening
                ? "Speak clearly into your microphone."
                : "Press the button and start speaking."}
            </p>
          </div>

          <div className="transcript-area">
            <div className="transcript-heading">
              <label htmlFor="transcript">Your transcription</label>
              <span>{transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words</span>
            </div>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              placeholder="Your recognized speech will appear here. You can also type or edit text manually."
              rows={6}
            />
            <div className="transcript-actions">
              <button type="button" className="button button-secondary" onClick={clearTranscript}>
                Clear text
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={saveTranscript}
                disabled={!transcript.trim() || listening}
              >
                Save transcription <span>↗</span>
              </button>
            </div>
          </div>

          {message && <div className="message" role="status">{message}</div>}
        </section>

        <section className="history-section">
          <div className="history-header">
            <div>
              <span className="section-number">02 / YOUR RECORDS</span>
              <h2>Transcription history</h2>
              <p>{history.length} saved {history.length === 1 ? "transcription" : "transcriptions"}.</p>
            </div>
            <button
              type="button"
              className="button button-secondary"
              onClick={fetchHistory}
              disabled={loadingHistory}
            >
              {loadingHistory ? "Loading..." : "Refresh history"}
            </button>
          </div>

          <div className="history-tools">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search saved transcriptions..."
              aria-label="Search saved transcriptions"
            />
            <select
              value={filterLanguage}
              onChange={(event) => setFilterLanguage(event.target.value)}
              aria-label="Filter by language"
            >
              <option value="All">All languages</option>
              {languageOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {loadingHistory && history.length === 0 ? (
            <p className="history-empty">Loading your transcriptions...</p>
          ) : visibleHistory.length === 0 ? (
            <div className="history-empty">
              <span className="empty-icon">📝</span>
              <h3>{history.length === 0 ? "No transcriptions yet" : "No matching transcriptions"}</h3>
              <p>
                {history.length === 0
                  ? "Save your first transcription and it will appear here."
                  : "Try another search term or language filter."}
              </p>
            </div>
          ) : (
            <div className="history-list">
              {visibleHistory.map((item) => (
                <article className="history-card" key={item.id}>
                  <div className="history-card-header">
                    <span className="history-language">{item.language}</span>
                    <span className="history-date">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </span>
                  </div>

                  {editingId === item.id ? (
                    <div className="edit-form">
                      <label htmlFor={`edit-language-${item.id}`}>Language</label>
                      <select
                        id={`edit-language-${item.id}`}
                        value={editLanguage}
                        onChange={(event) => setEditLanguage(event.target.value)}
                      >
                        {LANGUAGES.map((option) => (
                          <option key={option.label} value={option.label}>{option.label}</option>
                        ))}
                        {!LANGUAGES.some((option) => option.label === editLanguage) && editLanguage && (
                          <option value={editLanguage}>{editLanguage}</option>
                        )}
                      </select>
                      <label htmlFor={`edit-text-${item.id}`}>Transcription text</label>
                      <textarea
                        id={`edit-text-${item.id}`}
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        rows={4}
                      />
                      <div className="history-actions">
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={() => updateTranscription(item.id)}
                          disabled={busyId === item.id}
                        >
                          {busyId === item.id ? "Saving..." : "Save changes"}
                        </button>
                        <button type="button" className="button button-secondary" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="history-text">{item.transcribedText}</p>
                      <div className="history-actions">
                        <button type="button" className="button button-secondary" onClick={() => beginEdit(item)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button button-danger"
                          onClick={() => deleteTranscription(item)}
                          disabled={busyId === item.id}
                        >
                          {busyId === item.id ? "Please wait..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <span>PROCUCEV AI © 2026</span>
          <span>Built for clearer communication.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
