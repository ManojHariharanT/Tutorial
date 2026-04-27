const difficultyClassMap = {
  Easy: "lp-pill-easy",
  Medium: "lp-pill-medium",
  Hard: "lp-pill-hard",
};

const DifficultyPill = ({ difficulty }) => (
  <span className={`lp-difficulty-pill ${difficultyClassMap[difficulty] || ""}`}>{difficulty}</span>
);

export default DifficultyPill;
