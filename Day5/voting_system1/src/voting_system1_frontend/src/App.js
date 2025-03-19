import { HttpAgent } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { createActor } from "../../declarations/voting_system1_backend";
import "./App.css"; // Import the CSS file

// Set backend canister ID manually
const backendId = "dlbnd-beaaa-aaaaa-qaana-cai";
const agent = new HttpAgent();
const votingBackend = createActor(backendId, { agent });

function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await votingBackend.get_results();
        console.log("Voting Results:", data);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };
    fetchResults();
  }, []);

  const handleVote = async (candidateIndex) => {
    try {
      await votingBackend.vote(candidateIndex);
      const updatedResults = await votingBackend.get_results();
      setResults(updatedResults);
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="App">
      <h1>Voting For PLayers</h1>
      <div className="candidates">
        <button onClick={() => handleVote(0)}>
          Vote for Virat Kohli (RCB)
        </button>
        <button onClick={() => handleVote(1)}>
          Vote for Rohit Sharma (MI)
        </button>
        <button onClick={() => handleVote(2)}>Vote for M S Dhoni (CSK)</button>
      </div>
      <div className="results">
        <h2>Results</h2>
        {results.length > 0 ? (
          results.map((candidate, index) => (
            <p key={index}>
              {candidate.name} from {candidate.party}: {candidate.votes} votes
            </p>
          ))
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </div>
  );
}

export default App;
