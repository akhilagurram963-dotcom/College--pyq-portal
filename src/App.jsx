import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [papers, setPapers] = useState([]);

  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPapers();
  }, []);

  async function fetchPapers() {
    try {
      const res = await axios.get("http://localhost:5000/pdfs");
      setPapers(res.data);
    } catch (err) {
      console.log(err);
    }
  }
   async function deletePaper(id) {
    try {
    await axios.delete(`http://localhost:5000/delete/${id}`);

    alert("PYQ Deleted Successfully!");

    fetchPapers();
  } catch (err) {
    console.log(err);
    alert("Delete Failed");
  }
}

  async function uploadPYQ() {
   

    if (!subject || !branch || !year || !semester || !file) {
      alert("Please fill all fields and select a PDF.");
      return;
    }

    const formData = new FormData();

    formData.append("subject", subject);
    formData.append("branch", branch);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("pdf", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);

      alert("PYQ Uploaded Successfully!");

      setSubject("");
      setBranch("");
      setYear("");
      setSemester("");
      setFile(null);

      fetchPapers();
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }
  }

  return (
    <div className="container">
      <h1>College PYQ Portal</h1>

      <h2>Upload Previous Year Question Paper</h2>

      <input
        type="text"
        placeholder="Subject Name"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        type="text"
        placeholder="Branch"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      />

      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <input
        type="text"
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadPYQ}>
        Upload PDF
      </button>

      <hr />

      <h2>Search PYQ</h2>

      <input
        type="text"
        placeholder="Search Subject"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Available PYQs</h2>

      {papers
        .filter((paper) =>
          paper.subject.toLowerCase().includes(search.toLowerCase())
        )
        .map((paper) => (
          <div className="card" key={paper.id}>
            <h3>{paper.subject}</h3>

            <p><b>Branch:</b> {paper.branch}</p>

            <p><b>Year:</b> {paper.year}</p>

            <p><b>Semester:</b> {paper.semester}</p>

            <a
              href={`http://localhost:5000/uploads/${paper.pdf}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>View PDF</button>
            </a>
            <button
  onClick={() => deletePaper(paper.id)}
  style={{
    marginLeft: "10px",
    backgroundColor: "red",
    color: "white"
  }}
>
  Delete
</button>

            <hr />
          </div>
        ))}
    </div>
  );
}

export default App;