
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { getAuthToken, clearAuthSession } from "../../api/auth";

const DEFAULT_TRACK_ID = "10000000-0000-0000-0000-000000000001";

const NODE_W = 180;
const NODE_H = 58;
const GAP_X = 90;
const GAP_Y = 28;
const PADDING = 35;

// Calculate DAG layout
function calculateLayout(nodes, edges) {
  if (!nodes.length) {
    return { layoutNodes: [], width: 0, height: 0 };
  }

  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const prereqMap = new Map(nodes.map(node => [node.id, []]));

  edges.forEach(edge => {
    const pId = edge.prerequisiteSkillId;
    const dId = edge.dependentSkillId;

    if (pId !== dId && nodeMap.has(pId) && nodeMap.has(dId)) {
      prereqMap.get(dId).push(pId);
    }
  });

  const memo = new Map();

  function getColumn(id, visiting = new Set()) {
    if (memo.has(id)) return memo.get(id);
    if (visiting.has(id)) return 0;

    const nextVisiting = new Set(visiting);
    nextVisiting.add(id);

    const prereqs = prereqMap.get(id) || [];

    if (!prereqs.length) {
      memo.set(id, 0);
      return 0;
    }

    const column = Math.max(
      ...prereqs.map(pid => getColumn(pid, nextVisiting) + 1)
    );

    memo.set(id, column);
    return column;
  }

  const columns = [];

  nodes.forEach(node => {
    const col = getColumn(node.id);

    if (!columns[col]) columns[col] = [];

    columns[col].push(node);
  });

  const layoutNodes = [];
  let maxRows = 0;

  columns.forEach((column, colIndex) => {
    if (!column) return;

    column.sort((a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    maxRows = Math.max(maxRows, column.length);

    column.forEach((node, rowIndex) => {
      layoutNodes.push({
        ...node,
        x: PADDING + colIndex * (NODE_W + GAP_X),
        y: PADDING + rowIndex * (NODE_H + GAP_Y)
      });
    });
  });

  const width =
    PADDING * 2 +
    columns.length * NODE_W +
    (columns.length - 1) * GAP_X;

  const height =
    PADDING * 2 +
    maxRows * NODE_H +
    (maxRows - 1) * GAP_Y;

  return { layoutNodes, width, height };
}

// Status colors
function getNodeColors(node, selected) {
  const border = selected ? "#7c3aed" : null;

  switch ((node.status || "LOCKED").toUpperCase()) {
    case "COMPLETED":
    case "MASTERED":
      return {
        fill: "#dcfce7",
        stroke: border || "#22c55e",
        text: "#166534"
      };

    case "UNLOCKED":
    case "AVAILABLE":
    case "IN_PROGRESS":
      return {
        fill: "#ede9fe",
        stroke: border || "#a78bfa",
        text: "#5b21b6"
      };

    default:
      return {
        fill: "#f1f5f9",
        stroke: border || "#cbd5e1",
        text: "#64748b"
      };
  }
}

function truncate(value, max = 21) {
  if (!value) return "";

  return value.length > max
    ? value.slice(0, max - 1) + "…"
    : value;
}

// Loading and error card
function MessageCard({ title, message, buttonText, onButtonClick }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {message}
        </p>

        {buttonText && (
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

// Selected skill details
function SkillDetail({
  skill,
  prerequisiteNames,
  unlockNames,
  navigate
}) {
  if (!skill) return null;

  const mastery = Number(skill.masteryScore ?? 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Selected Skill
          </span>

          <h3 className="mt-1 text-2xl font-bold text-slate-800">
            {skill.name}
          </h3>
        </div>

        <button
          onClick={() => navigate("/assessment")}
          className="self-start rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
        >
          Take Assessment
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Category</span>
          <p className="mt-1 font-semibold text-slate-700">
            {skill.categoryName || "General"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Status</span>
          <p className="mt-1 font-semibold text-slate-700">
            {skill.status || "LOCKED"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Mastery Score</span>
          <p className="mt-1 font-semibold text-slate-700">
            {Math.round(mastery * 100)}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Difficulty</span>
          <p className="mt-1 font-semibold text-slate-700">
            {skill.difficultyLevel || "Unspecified"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Prerequisites</span>
          <p className="mt-1 text-sm text-slate-700">
            {prerequisiteNames.join(", ") || "None"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs text-slate-500">Unlocks</span>
          <p className="mt-1 text-sm text-slate-700">
            {unlockNames.join(", ") || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkillGraph() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch latest personalized graph
  const loadGraph = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/progress/tracks/${DEFAULT_TRACK_ID}/graph`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          cache: "no-store"
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Unable to fetch graph. HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const fetchedNodes = Array.isArray(data.nodes)
        ? data.nodes
        : [];

      const fetchedEdges = Array.isArray(data.edges)
        ? data.edges
        : [];

      setNodes(fetchedNodes);
      setEdges(fetchedEdges);

      // Preserve the selected skill after refresh
      setSelectedId(previousId =>
        fetchedNodes.some(node => node.id === previousId)
          ? previousId
          : fetchedNodes[0]?.id || null
      );

    } catch (err) {
      console.error("Skill graph error:", err);
      setError(err.message || "Failed to load skill graph");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch when graph page opens
  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading your skill graph...
        </p>
      </div>
    );
  }

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

  if (!nodes.length) {
    return (
      <MessageCard
        title="No Skills Found"
        message="No skills are available for this learning track."
        buttonText="Dashboard"
        onButtonClick={() => navigate("/dashboard")}
      />
    );
  }

  const {
    layoutNodes,
    width,
    height
  } = calculateLayout(nodes, edges);

  const nodeMap = new Map(
    layoutNodes.map(node => [node.id, node])
  );

  const selectedNode =
    nodeMap.get(selectedId) || layoutNodes[0];

  const prerequisiteNames = edges
    .filter(edge =>
      edge.dependentSkillId === selectedNode?.id
    )
    .map(edge =>
      nodeMap.get(edge.prerequisiteSkillId)?.name
    )
    .filter(Boolean);

  const unlockNames = edges
    .filter(edge =>
      edge.prerequisiteSkillId === selectedNode?.id
    )
    .map(edge =>
      nodeMap.get(edge.dependentSkillId)?.name
    )
    .filter(Boolean);

  const masteredCount = nodes.filter(node =>
    ["COMPLETED", "MASTERED"].includes(
      (node.status || "").toUpperCase()
    )
  ).length;

  const unlockedCount = nodes.filter(node =>
    ["UNLOCKED", "AVAILABLE", "IN_PROGRESS"].includes(
      (node.status || "").toUpperCase()
    )
  ).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Heading and Navigation */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              My Skill Graph
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your learning progress and skill dependencies.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-violet-200 px-5 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 cursor-pointer"
            >
              Dashboard
            </button>

            <button
              onClick={loadGraph}
              className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
            >
              Refresh Graph
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Total Skills</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {nodes.length}
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-xs text-slate-500">Unlocked</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">
              {unlockedCount}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-xs text-slate-500">Mastered</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {masteredCount}
            </p>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow">
        <svg
          width={Math.max(width, 700)}
          height={Math.max(height, 350)}
          className="block select-none"
        >
          <defs>
            <marker
              id="skill-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                fill="#cbd5e1"
              />
            </marker>

            <marker
              id="selected-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                fill="#7c3aed"
              />
            </marker>
          </defs>

          {/* Dependency Edges */}
          {edges.map((edge, index) => {
            const start = nodeMap.get(edge.prerequisiteSkillId);
            const end = nodeMap.get(edge.dependentSkillId);

            if (!start || !end) return null;

            const highlighted =
              edge.prerequisiteSkillId === selectedNode?.id ||
              edge.dependentSkillId === selectedNode?.id;

            const startX = start.x + NODE_W;
            const startY = start.y + NODE_H / 2;
            const endX = end.x;
            const endY = end.y + NODE_H / 2;
            const middleX = (startX + endX) / 2;

            return (
              <path
                key={`${edge.prerequisiteSkillId}-${edge.dependentSkillId}-${index}`}
                d={`M ${startX} ${startY} C ${middleX} ${startY}, ${middleX} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={highlighted ? "#7c3aed" : "#cbd5e1"}
                strokeWidth={highlighted ? 2.5 : 1.5}
                markerEnd={
                  highlighted
                    ? "url(#selected-arrow)"
                    : "url(#skill-arrow)"
                }
              />
            );
          })}

          {/* Skill Nodes */}
          {layoutNodes.map(node => {
            const selected = node.id === selectedNode?.id;
            const colors = getNodeColors(node, selected);

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
                  rx={9}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={selected ? 2.5 : 1.5}
                />

                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + 23}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  className="text-xs font-semibold pointer-events-none"
                >
                  {truncate(node.name)}
                </text>

                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + 42}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="9"
                  className="pointer-events-none"
                >
                  {node.status || "LOCKED"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 rounded-xl bg-white p-4 shadow">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-3 w-3 rounded bg-green-400" />
          Completed
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-3 w-3 rounded bg-violet-400" />
          Unlocked
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-3 w-3 rounded bg-slate-300" />
          Locked
        </div>
      </div>

      {/* Selected Skill Details */}
      <SkillDetail
        skill={selectedNode}
        prerequisiteNames={prerequisiteNames}
        unlockNames={unlockNames}
        navigate={navigate}
      />

    </div>
  );
}
