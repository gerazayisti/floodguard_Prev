// @ts-nocheck
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { performDataAnalysis, proposeAndSignInitiative } from '@/utils/litProtocol';
import { useSessionSigs } from '@/hooks/useSessionSigs';

export default function ContractInteraction({ onfloodReport }) {
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [insights, setInsights] = useState(null);
  const [proposal, setProposal] = useState('');
  const [proposalResult, setProposalResult] = useState(null);
  const sessionSigs = useSessionSigs();

  const handleSubmit = (e) => {
    e.preventDefault();
    onfloodReport(location, quantity);
    setLocation('');
    setQuantity('');
  };

  const handleAnalyze = async () => {
    const results = await performDataAnalysis(sessionSigs);
    setInsights(results);
  };

  const handlePropose = async () => {
    const result = await proposeAndSignInitiative(sessionSigs, proposal);
    setProposalResult(result);
    setProposal('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <Button type="submit">Report flood</Button>
      </form>
      <Button onClick={handleAnalyze}>Analyze Data</Button>
      {insights && (
        <div>
          <h2>Insights</h2>
          <p>Total flood: {insights.totalflood}</p>
          <p>Average flood: {insights.averageflood}</p>
          <p>Hotspot Count: {insights.hotspotCount}</p>
        </div>
      )}
      <div>
        <h2>Propose Initiative</h2>
        <Input
          type="text"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Enter your proposal"
        />
        <Button onClick={handlePropose}>Submit Proposal</Button>
      </div>
      {proposalResult && (
        <div>
          <h3>Proposal Result</h3>
          {proposalResult.success ? (
            <p>Proposal submitted successfully. Transaction Hash: {proposalResult.txHash}</p>
          ) : (
            <p>Proposal needs more signatures. Current count: {proposalResult.sigCount}</p>
          )}
        </div>
      )}
    </div>
  );
}