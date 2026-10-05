import EvaluationReport from '../simulator/EvaluationReport';

/**
 * ScorecardModal is unified with EvaluationReport to ensure consistent,
 * modern mobile and desktop UX across all entry points in CaseCraft.
 */
export default function ScorecardModal(props) {
  return <EvaluationReport {...props} />;
}
