import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { getAuthToken, clearAuthSession } from "../../api/auth";

const DEFAULT_TRACK_ID = "10000000-0000-0000-0000-000000000001";

// Fixed dimensions for graph nodes and spacing
const NODE_W = 180;
const NODE_H = 52;
const GAP_X = 90;
const GAP_Y = 24;
const PADDING = 30;

// Calculate DAG layout coordinates for nodes
function calculateLayout(nodes, edges) {
  if (!nodes || nodes.length === 0) {
    return { layoutNodes: [], width: 0, height: 0 };
  }

  const nodeMap = new Map();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  // Map each dependent skill to its prerequisite skill IDs
  // Self-edges and edges with missing nodes are ignored
  const prereqMap = new Map();
  nodes.forEach((node) => prereqMap.set(node.id, []));

  edges.forEach((edge) => {
    const { prerequisiteSkillId: pId, dependentSkillId: dId } = edge;
    if (pId && dId && pId !== dId && nodeMap.has(pId) && nodeMap.has(dId)) {
      prereqMap.get(dId).push(pId);
    }
  });

  // Column equals the length of the longest chain of prerequisites before this node
  const colMemo = new Map();

  function getColumn(nodeId, visited = new Set()) {
    if (colMemo.has(nodeId)) return colMemo.get(nodeId);
    // Visited guard stops recursion if circular dependencies exist in the data
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);

    const prereqs = prereqMap.get(nodeId) || [];
    if (prereqs.length === 0) {
      colMemo.set(nodeId, 0);
      return 0;
    }

    let maxCol = 0;
    for (const pid of prereqs) {
      const parentCol = getColumn(pid, new Set(visited));
      if (parentCol + 1 > maxCol) maxCol = parentCol + 1;
    }

    colMemo.set(nodeId, maxCol);
    return maxCol;
  }

  // Group nodes by column index
  const columns = [];
  nodes.forEach((node) => {
    const colIndex = getColumn(node.id);
    if (!columns[colIndex]) columns[colIndex] = [];
    columns[colIndex].push(node);
  });

  // Sort nodes vertically in each column and calculate x, y coordinates
  const layoutNodes = [];
  let maxRows = 0;

  columns.forEach((colNodes, colIndex) => {
    if (!colNodes) return;
    colNodes.sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });

    if (colNodes.length > maxRows) maxRows = colNodes.length;

    colNodes.forEach((node, rowIndex) => {
      layoutNodes.push({
        ...node,
        x: PADDING + colIndex * (NODE_W + GAP_X),
        y: PADDING + rowIndex * (NODE_H + GAP_Y),
        col: colIndex,
        row: rowIndex,
      });
    });
  });

  const totalCols = columns.length;
  const width = totalCols > 0 ? PADDING * 2 + totalCols * NODE_W + (totalCols - 1) * GAP_X : 0;
  const height = maxRows > 0 ? PADDING * 2 + maxRows * NODE_H + (maxRows - 1) * GAP_Y : 0;

  return { layoutNodes, width, height };
}

// Truncate long skill names with an ellipsis so they fit inside node boxes
function truncate(text, maxLength = 20) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

// Determine node styling: only colour by status if node.status actually exists
function getNodeColors(node, isSelected) {
  const selectedBorder = isSelected ? "#7c3aed" : null;
  const strokeWidth = isSelected ? 2 : 1;

  if (node.status === "COMPLETED") {
    return { fill: "#f0fdf4", stroke: selectedBorder || "#86efac", text: "#15803d", strokeWidth };
  }
  if (node.status === "IN_PROGRESS" || node.status === "UNLOCKED" || node.status === "AVAILABLE") {
    return { fill: "#f5f3ff", stroke: selectedBorder || "#c4b5fd", text: "#6d28d9", strokeWidth };
  }
  if (node.status === "LOCKED") {
    return { fill: "#f8fafc", stroke: selectedBorder || "#e2e8f0", text: "#94a3b8", strokeWidth };
  }

  // Neutral slate palette when status field is not returned
  return { fill: "#ffffff", stroke: selectedBorder || "#cbd5e1", text: "#334155", strokeWidth };
}

// Reusable card for states like assessment gate, login required, errors, and empty graph
function MessageCard({ title, message, buttonText, onButtonClick }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        {buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="mt-6 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

// Details panel shown below the graph for the currently selected skill
function SkillDetail({ skill, prerequisiteNames, unlockNames, onStartAssessment, navigate }) {
  if (!skill) return null;

  function handleAssessmentClick() {
    if (onStartAssessment) {
      onStartAssessment(skill.name);
    } else {
      navigate("/assessment");
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Selected Skill
          </span>
          <h3 className="mt-1 text-2xl font-bold text-slate-800">{skill.name}</h3>
        </div>
        <button
          onClick={handleAssessmentClick}
          className="self-start rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
        >
          Take assessment
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-medium text-slate-500">Category</span>
          <p className="mt-1 font-semibold text-slate-700">{skill.categoryName || "General"}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-medium text-slate-500">Difficulty Level</span>
          <p className="mt-1 font-semibold text-slate-700 capitalize">
            {skill.difficultyLevel ? skill.difficultyLevel.toLowerCase() : "Unspecified"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-medium text-slate-500">Prerequisites</span>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {prerequisiteNames && prerequisiteNames.length > 0
              ? prerequisiteNames.join(", ")
              : "None, you can start here"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-medium text-slate-500">Unlocks</span>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {unlockNames && unlockNames.length > 0 ? unlockNames.join(", ") : "None"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillGraph({ onStartAssessment }) {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const token = getAuthToken();
  const hasAssessment = localStorage.getItem("assessment_completed") === "true";

  async function loadGraph() {
    const currentToken = getAuthToken();
    if (!currentToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/progress/tracks/${DEFAULT_TRACK_ID}/graph`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const fetchedNodes = Array.isArray(data?.nodes) ? data.nodes : [];
      const fetchedEdges = Array.isArray(data?.edges) ? data.edges : [];

      setNodes(fetchedNodes);
      setEdges(fetchedEdges);

      if (fetchedNodes.length > 0) {
        setSelectedId(fetchedNodes[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load skill graph");
    } finally {
      setLoading(false);
    }
  }

  // Mount effect: fetch graph only when component mounts and requirements are met
  useEffect(() => {
    if (!hasAssessment || !token) {
      return;
    }
    loadGraph();
  }, [hasAssessment, token]);

  // Assessment gate
  if (!hasAssessment) {
    return (
      <MessageCard
        title="Assessment Required"
        message="Attempt the assessment first to see your skill graph"
        buttonText="Take Assessment"
        onButtonClick={() => {
          if (onStartAssessment) {
            onStartAssessment();
          } else {
            navigate("/assessment");
          }
        }}
      />
    );
  }

  // Authentication check
  if (!token) {
    return (
      <MessageCard
        title="Sign In Required"
        message="Please sign in to view your skill graph."
        buttonText="Sign In"
        onButtonClick={() => navigate("/login")}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading skill graph...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <MessageCard
        title="Could Not Load Graph"
        message={error}
        buttonText="Retry"
        onButtonClick={loadGraph}
      />
    );
  }

  // Empty state
  if (nodes.length === 0) {
    return (
      <MessageCard
        title="No Skills Found"
        message="No skills found for this track"
      />
    );
  }

  // Calculate layout and node coordinates
  const { layoutNodes, width, height } = calculateLayout(nodes, edges);

  const nodeMap = new Map();
  layoutNodes.forEach((node) => nodeMap.set(node.id, node));

  const selectedNode = nodeMap.get(selectedId) || layoutNodes[0];

  // Resolve prerequisite and unlock names for selected skill
  const prerequisiteNames = edges
    .filter((edge) => edge.dependentSkillId === selectedNode?.id)
    .map((edge) => nodeMap.get(edge.prerequisiteSkillId)?.name)
    .filter(Boolean);

  const unlockNames = edges
    .filter((edge) => edge.prerequisiteSkillId === selectedNode?.id)
    .map((edge) => nodeMap.get(edge.dependentSkillId)?.name)
    .filter(Boolean);

  const svgWidth = Math.max(width, 700);
  const svgHeight = Math.max(height, 350);

  return (
    <div className="flex flex-col gap-6">
      {/* Heading and Hint */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">My Skill Graph</h2>
        <p className="mt-1 text-sm text-slate-500">
          Arrows point from a skill to the skills it unlocks. Click a skill to see details.
        </p>
      </div>

      {/* SVG DAG Area */}
      <div className="rounded-2xl bg-white p-6 shadow overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block select-none">
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#cbd5e1" />
            </marker>
            <marker
              id="arrow-selected"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7c3aed" />
            </marker>
          </defs>

          {/* Edges */}
          <g>
            {edges.map((edge, index) => {
              const startNode = nodeMap.get(edge.prerequisiteSkillId);
              const endNode = nodeMap.get(edge.dependentSkillId);
              if (!startNode || !endNode) return null;

              const isSelectedEdge =
                selectedNode &&
                (edge.prerequisiteSkillId === selectedNode.id ||
                  edge.dependentSkillId === selectedNode.id);

              const startX = startNode.x + NODE_W;
              const startY = startNode.y + NODE_H / 2;
              const endX = endNode.x;
              const endY = endNode.y + NODE_H / 2;
              const midX = (startX + endX) / 2;

              const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

              return (
                <path
                  key={`${edge.prerequisiteSkillId}-${edge.dependentSkillId}-${index}`}
                  d={pathData}
                  fill="none"
                  stroke={isSelectedEdge ? "#7c3aed" : "#cbd5e1"}
                  strokeWidth={isSelectedEdge ? 2 : 1.5}
                  markerEnd={isSelectedEdge ? "url(#arrow-selected)" : "url(#arrow-default)"}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {layoutNodes.map((node) => {
              const isSelected = selectedNode && node.id === selectedNode.id;
              const colors = getNodeColors(node, isSelected);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={colors.strokeWidth}
                  />
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + NODE_H / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={colors.text}
                    className="text-xs font-semibold select-none pointer-events-none"
                  >
                    {truncate(node.name, 20)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Skill Details */}
      <SkillDetail
        skill={selectedNode}
        prerequisiteNames={prerequisiteNames}
        unlockNames={unlockNames}
        onStartAssessment={onStartAssessment}
        navigate={navigate}
      />
    </div>
  );
}

export default SkillGraph;
