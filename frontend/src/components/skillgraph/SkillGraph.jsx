import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  useViewport,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Code2,
  Layers,
  Database,
  Globe,
  Box,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Zap,
  AlertCircle,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { getAuthToken, clearAuthSession } from "../../api/auth";
import { fetchQuestionsBySkill } from "../../api/skillQuestions";

const DEFAULT_TRACK_ID = "10000000-0000-0000-0000-000000000001";

// Category color identities matching reference design
const CATEGORY_THEMES = {
  "Programming Fundamentals (Java)": {
    accent: "bg-amber-400",
    border: "border-amber-300",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Code2,
  },
  "Object-Oriented Programming and Java": {
    accent: "bg-[#7056ED]",
    border: "border-purple-300",
    badge: "bg-purple-50 text-[#7056ED] border-purple-200",
    icon: Layers,
  },
  "Database Management": {
    accent: "bg-emerald-500",
    border: "border-emerald-300",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: Database,
  },
  "Networking and API Development": {
    accent: "bg-sky-500",
    border: "border-sky-300",
    badge: "bg-sky-50 text-sky-800 border-sky-200",
    icon: Globe,
  },
  "Spring Boot, Testing and Deployment": {
    accent: "bg-rose-500",
    border: "border-rose-300",
    badge: "bg-rose-50 text-rose-800 border-rose-200",
    icon: Box,
  },
  "Java Collections and Problem Solving": {
    accent: "bg-indigo-500",
    border: "border-indigo-300",
    badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
    icon: BookOpen,
  },
};

const DEFAULT_THEME = {
  accent: "bg-slate-500",
  border: "border-slate-300",
  badge: "bg-slate-50 text-slate-700 border-slate-200",
  icon: Code2,
};

// Calculate clean horizontal DAG layout per category
function calculateCategoryLayout(nodes, edges) {
  if (!nodes.length) return [];

  const nodeCatMap = new Map(nodes.map((n) => [n.id, n.categoryName || "General"]));
  const internalPrereqs = new Map(nodes.map((n) => [n.id, []]));

  // Connect prerequisites within the same category for clean horizontal progression
  edges.forEach((edge) => {
    const pCat = nodeCatMap.get(edge.prerequisiteSkillId);
    const dCat = nodeCatMap.get(edge.dependentSkillId);
    if (pCat && dCat && pCat === dCat) {
      internalPrereqs.get(edge.dependentSkillId)?.push(edge.prerequisiteSkillId);
    }
  });

  // Calculate local rank/column within category
  const rankMap = new Map();
  function getRank(id, visited = new Set()) {
    if (rankMap.has(id)) return rankMap.get(id);
    if (visited.has(id)) return 0;
    visited.add(id);

    const prereqs = internalPrereqs.get(id) || [];
    if (!prereqs.length) {
      rankMap.set(id, 0);
      return 0;
    }

    const rank = Math.max(...prereqs.map((pid) => getRank(pid, new Set(visited)))) + 1;
    rankMap.set(id, rank);
    return rank;
  }

  nodes.forEach((n) => getRank(n.id));

  // Group by category preserving stable category order
  const categories = Array.from(new Set(nodes.map((n) => n.categoryName || "General")));
  const catNodesMap = new Map();
  categories.forEach((cat) => catNodesMap.set(cat, []));
  nodes.forEach((n) => catNodesMap.get(n.categoryName || "General")?.push(n));

  const NODE_W = 280;
  const NODE_H = 100;
  const GAP_X = 90;
  const GAP_Y = 28;
  const LANE_GAP = 50;
  const START_X = 60;
  let currentY = 60;

  const positions = [];

  categories.forEach((cat) => {
    const list = catNodesMap.get(cat) || [];
    if (!list.length) return;

    // Group items in this category by column/rank
    const colBuckets = {};
    list.forEach((n) => {
      const col = rankMap.get(n.id) || 0;
      if (!colBuckets[col]) colBuckets[col] = [];
      colBuckets[col].push(n);
    });

    let maxRowsInLane = 1;
    Object.keys(colBuckets).forEach((colStr) => {
      const col = Number(colStr);
      const bucket = colBuckets[col];
      bucket.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      maxRowsInLane = Math.max(maxRowsInLane, bucket.length);

      bucket.forEach((item, rowIdx) => {
        positions.push({
          id: item.id,
          x: START_X + col * (NODE_W + GAP_X),
          y: currentY + rowIdx * (NODE_H + GAP_Y),
        });
      });
    });

    currentY += maxRowsInLane * (NODE_H + GAP_Y) + LANE_GAP;
  });

  return positions;
}

// Custom Skill Card Node - Spacious, legible, styled to match reference image
function SkillCardNode({ data, id }) {
  const {
    name,
    categoryName,
    difficultyLevel,
    status = "LOCKED",
    masteryScore = 0,
    selected,
    onNodeSelect,
  } = data;

  const theme = CATEGORY_THEMES[categoryName] || DEFAULT_THEME;
  const IconComponent = theme.icon;

  const normalizedStatus = (status || "LOCKED").toUpperCase();
  const isMastered = normalizedStatus === "COMPLETED" || normalizedStatus === "MASTERED";
  const isUnlocked =
    normalizedStatus === "UNLOCKED" ||
    normalizedStatus === "AVAILABLE" ||
    normalizedStatus === "IN_PROGRESS";

  const difficultyPill =
    difficultyLevel === "BEGINNER"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
      : difficultyLevel === "ADVANCED"
      ? "text-rose-700 bg-rose-50 border-rose-200/80"
      : "text-amber-700 bg-amber-50 border-amber-200/80";

  return (
    <div
      onClick={() => {
        if (onNodeSelect) {
          onNodeSelect(id || data.id);
        }
      }}
      className={`group relative flex w-[280px] min-h-[100px] items-stretch rounded-2xl bg-white transition-all duration-150 cursor-pointer ${
        selected
          ? "ring-2 ring-[#7056ED] shadow-xl shadow-purple-500/15 border-transparent scale-[1.02]"
          : "border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !-left-1.5 !border-2 !border-white !bg-slate-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !-right-1.5 !border-2 !border-white !bg-slate-400"
      />

      {/* Left Colored Accent Pill with Category Icon */}
      <div
        className={`flex w-14 shrink-0 items-center justify-center rounded-l-2xl ${theme.accent} text-white shadow-inner`}
      >
        <IconComponent className="h-6 w-6 drop-shadow-sm" />
      </div>

      {/* Card Content Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {categoryName}
          </span>

          <div>
            {isMastered ? (
              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Done
              </span>
            ) : isUnlocked ? (
              <span className="flex items-center gap-1 rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#7056ED]">
                <Unlock className="h-3 w-3" />
                Open
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            )}
          </div>
        </div>

        <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-800" title={name}>
          {name}
        </h4>

        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${difficultyPill}`}>
            {difficultyLevel || "BEGINNER"}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-[#7056ED] border border-purple-100">
            <HelpCircle className="h-3 w-3" />
            5 Questions
          </span>
        </div>
      </div>
    </div>
  );
}

// Automatically centers and fits the active category with comfortable reading zoom
function FitViewWatcher({ category, nodeCount }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (category === "ALL") {
        fitView({
          padding: 0.15,
          duration: 350,
        });
      } else {
        fitView({
          padding: 0.22,
          minZoom: 0.7,
          maxZoom: 1.0,
          duration: 350,
        });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [category, nodeCount, fitView]);

  return null;
}

// Anchored permanently to the bottom-right corner inside the canvas
function FlowControls({ category }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round((zoom || 1) * 100);

  const handleFit = () => {
    if (category === "ALL") {
      fitView({ padding: 0.15, duration: 300 });
    } else {
      fitView({ padding: 0.22, minZoom: 0.7, maxZoom: 1.0, duration: 300 });
    }
  };

  return (
    <Panel position="bottom-right" className="!m-4 !pointer-events-auto">
      <div className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <button
          onClick={() => zoomOut()}
          title="Zoom Out"
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <span className="min-w-[42px] text-center text-xs font-semibold text-slate-700 select-none">
          {zoomPercent}%
        </span>

        <button
          onClick={() => zoomIn()}
          title="Zoom In"
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-slate-200" />

        <button
          onClick={handleFit}
          title="Fit to Screen"
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Panel>
  );
}

const nodeTypes = {
  skillNode: SkillCardNode,
};

export default function SkillGraph({ onStartAssessment }) {
  const navigate = useNavigate();

  const [rawNodes, setRawNodes] = useState([]);
  const [rawEdges, setRawEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Unable to fetch graph. HTTP ${response.status}`);
      }

      const data = await response.json();
      const fetchedNodes = Array.isArray(data.nodes) ? data.nodes : [];
      const fetchedEdges = Array.isArray(data.edges) ? data.edges : [];

      setRawNodes(fetchedNodes);
      setRawEdges(fetchedEdges);

      setSelectedId((prev) =>
        fetchedNodes.some((n) => n.id === prev) ? prev : fetchedNodes[0]?.id || null
      );
    } catch (err) {
      console.error("Skill graph error:", err);
      setError(err.message || "Failed to load skill graph");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const categories = useMemo(() => {
    return Array.from(new Set(rawNodes.map((n) => n.categoryName).filter(Boolean)));
  }, [rawNodes]);

  // Filtered nodes and edges according to selected category
  const { visibleNodes, visibleEdges } = useMemo(() => {
    if (selectedCategory === "ALL") {
      return { visibleNodes: rawNodes, visibleEdges: rawEdges };
    }

    const filtered = rawNodes.filter((n) => n.categoryName === selectedCategory);
    const idSet = new Set(filtered.map((n) => n.id));
    const edges = rawEdges.filter(
      (e) => idSet.has(e.prerequisiteSkillId) && idSet.has(e.dependentSkillId)
    );

    return { visibleNodes: filtered, visibleEdges: edges };
  }, [rawNodes, rawEdges, selectedCategory]);

  const selectedNode = useMemo(() => {
    return (
      visibleNodes.find((n) => n.id === selectedId) ||
      rawNodes.find((n) => n.id === selectedId) ||
      visibleNodes[0] ||
      null
    );
  }, [visibleNodes, rawNodes, selectedId]);

  const prerequisiteNames = useMemo(() => {
    if (!selectedNode) return [];
    const nodeMap = new Map(rawNodes.map((n) => [n.id, n]));
    return rawEdges
      .filter((e) => e.dependentSkillId === selectedNode.id)
      .map((e) => nodeMap.get(e.prerequisiteSkillId)?.name)
      .filter(Boolean);
  }, [selectedNode, rawNodes, rawEdges]);

  const unlockNames = useMemo(() => {
    if (!selectedNode) return [];
    const nodeMap = new Map(rawNodes.map((n) => [n.id, n]));
    return rawEdges
      .filter((e) => e.prerequisiteSkillId === selectedNode.id)
      .map((e) => nodeMap.get(e.dependentSkillId)?.name)
      .filter(Boolean);
  }, [selectedNode, rawNodes, rawEdges]);

  // Skill questions state for the interactive quick-test question card
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Fetch 5 questions whenever selectedNode changes
  useEffect(() => {
    let isCancelled = false;

    if (!selectedNode) {
      setQuestions([]);
      setQuestionsLoading(false);
      setQuestionsError(null);
      return;
    }

    setQuestionsLoading(true);
    setQuestionsError(null);

    fetchQuestionsBySkill(selectedNode)
      .then((res) => {
        if (!isCancelled) {
          setQuestions(res || []);
          setQuestionsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Error fetching skill questions:", err);
          setQuestionsError("Failed to fetch questions for this skill. Please try again.");
          setQuestionsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedNode?.id]);

  const handleTakeQuickTest = useCallback(
    (targetNode) => {
      const nodeToTest = targetNode || selectedNode;
      if (!nodeToTest) return;

      if (onStartAssessment) {
        onStartAssessment(nodeToTest);
      } else {
        const skillIdentifier = nodeToTest.id || nodeToTest.slug;
        navigate(`/milestone-assessment/${encodeURIComponent(skillIdentifier)}`);
      }
    },
    [onStartAssessment, selectedNode, navigate]
  );

  // Compute React Flow nodes and edges with clean positions
  const { flowNodes, flowEdges } = useMemo(() => {
    if (!visibleNodes.length) return { flowNodes: [], flowEdges: [] };

    const positions = calculateCategoryLayout(visibleNodes, visibleEdges);
    const posMap = new Map(positions.map((p) => [p.id, p]));

    const nodes = visibleNodes.map((node) => {
      const pos = posMap.get(node.id) || { x: 0, y: 0 };
      return {
        id: node.id,
        type: "skillNode",
        position: { x: pos.x, y: pos.y },
        data: {
          ...node,
          selected: node.id === selectedNode?.id,
          onNodeSelect: (nodeId) => {
            setSelectedId(nodeId);
            setIsQuestionModalOpen(true);
          },
        },
      };
    });

    const edges = visibleEdges.map((edge, idx) => {
      const isConnected =
        edge.prerequisiteSkillId === selectedNode?.id ||
        edge.dependentSkillId === selectedNode?.id;

      return {
        id: `e-${edge.prerequisiteSkillId}-${edge.dependentSkillId}-${idx}`,
        source: edge.prerequisiteSkillId,
        target: edge.dependentSkillId,
        type: "smoothstep",
        animated: isConnected,
        style: {
          stroke: isConnected ? "#7056ED" : "#94a3b8",
          strokeWidth: isConnected ? 2.5 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: isConnected ? "#7056ED" : "#94a3b8",
        },
      };
    });

    return { flowNodes: nodes, flowEdges: edges };
  }, [visibleNodes, visibleEdges, selectedNode]);

  const masteredCount = rawNodes.filter((n) =>
    ["COMPLETED", "MASTERED"].includes((n.status || "").toUpperCase())
  ).length;

  const unlockedCount = rawNodes.filter((n) =>
    ["UNLOCKED", "AVAILABLE", "IN_PROGRESS"].includes((n.status || "").toUpperCase())
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-violet-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">Loading your skill graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[360px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h3 className="text-lg font-bold text-slate-800">Could Not Load Graph</h3>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button
            onClick={loadGraph}
            className="mt-6 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!rawNodes.length) {
    return (
      <div className="flex min-h-[360px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h3 className="text-lg font-bold text-slate-800">No Skills Found</h3>
          <p className="mt-2 text-sm text-slate-600">
            No skills are available for this learning track.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Inline styles to guarantee white dotted canvas regardless of OS dark mode */}
      <style>{`
        .skill-flow-wrapper .react-flow {
          background-color: #ffffff !important;
          color-scheme: light !important;
          --xy-background-color: #ffffff !important;
          --xy-background-color-default: #ffffff !important;
          --xy-edge-stroke-default: #94a3b8 !important;
        }
        .skill-flow-wrapper .react-flow__background {
          background-color: #ffffff !important;
        }
      `}</style>

      {/* Header and Progress Summary */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Skill Graph</h2>
            <p className="mt-1 text-sm text-slate-500">
              Interactive prerequisite roadmap organized by learning category.
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
              className="flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 cursor-pointer shadow-sm shadow-purple-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              Refresh Graph
            </button>
          </div>
        </div>

        {/* Top Stats Counters */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Total Skills</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{rawNodes.length}</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4">
            <p className="text-xs font-medium text-purple-600">Unlocked</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">{unlockedCount}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-xs font-medium text-emerald-600">Mastered</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{masteredCount}</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filter:
          </span>

          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories ({rawNodes.length})
          </button>

          {categories.map((cat) => {
            const theme = CATEGORY_THEMES[cat] || DEFAULT_THEME;
            const count = rawNodes.filter((n) => n.categoryName === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-transparent bg-violet-600 text-white shadow-sm"
                    : `${theme.badge} hover:brightness-95`
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean White Dotted Workflow Canvas */}
      <div className="skill-flow-wrapper relative h-[620px] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <ReactFlowProvider>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => {
              setSelectedId(node.id);
              setIsQuestionModalOpen(true);
            }}
            className="light bg-white"
            style={{ backgroundColor: "#ffffff", colorScheme: "light" }}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={1.8}
            defaultEdgeOptions={{ type: "smoothstep" }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="#cbd5e1"
              bgColor="#ffffff"
              style={{ backgroundColor: "#ffffff" }}
            />
            <FitViewWatcher
              category={selectedCategory}
              nodeCount={visibleNodes.length}
            />
            <FlowControls category={selectedCategory} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Interactive Skill Questions Card */}
      {selectedNode && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7056ED]">
                  {selectedNode.categoryName || "Skill Assessment"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-[#7056ED] border border-purple-200">
                  <HelpCircle className="h-3 w-3" />
                  5 Questions
                </span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-slate-800">
                {selectedNode.name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Review key questions for this skill to test your understanding, or start a quick test.
              </p>
            </div>

            {/* Prominent Take a Quick Test Button */}
            <button
              onClick={() => handleTakeQuickTest(selectedNode)}
              className="flex items-center justify-center gap-2 self-start sm:self-center rounded-full bg-[#7056ED] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5f44e2] cursor-pointer shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Take a Quick Test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Question List / States */}
          <div className="mt-5">
            {questionsLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#7056ED] border-t-transparent" />
                <p className="text-sm font-medium text-slate-500">
                  Fetching questions for <span className="font-semibold text-slate-700">{selectedNode.name}</span>...
                </p>
              </div>
            )}

            {!questionsLoading && questionsError && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-6 text-center">
                <AlertCircle className="mx-auto h-6 w-6 text-rose-500 mb-2" />
                <p className="text-sm font-semibold text-rose-800">{questionsError}</p>
                <button
                  onClick={() => {
                    setQuestionsLoading(true);
                    setQuestionsError(null);
                    fetchQuestionsBySkill(selectedNode)
                      .then((res) => {
                        setQuestions(res || []);
                        setQuestionsLoading(false);
                      })
                      .catch(() => {
                        setQuestionsError("Failed to fetch questions for this skill.");
                        setQuestionsLoading(false);
                      });
                  }}
                  className="mt-3 rounded-full bg-rose-600 px-5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer"
                >
                  Retry Fetching
                </button>
              </div>
            )}

            {!questionsLoading && !questionsError && questions.length > 0 && (
              <div className="space-y-3.5">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-purple-200 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-[#7056ED]">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {q.text}
                          </p>
                          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {q.difficulty || "BEGINNER"}
                          </span>
                        </div>

                        {q.options && Object.keys(q.options).length > 0 && (
                          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(q.options).map(([optKey, optText]) => (
                              <div
                                key={optKey}
                                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-700"
                              >
                                <span className="font-bold text-[#7056ED]">{optKey}.</span>
                                <span className="truncate">{optText}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-800">Ready to test your knowledge?</p>
                    <p className="text-xs text-slate-500">Start the test to evaluate your mastery and update your graph.</p>
                  </div>
                  <button
                    onClick={() => handleTakeQuickTest(selectedNode)}
                    className="flex items-center gap-1.5 rounded-full bg-[#7056ED] px-6 py-2 text-xs font-semibold text-white hover:bg-[#5f44e2] cursor-pointer shadow-sm shadow-purple-500/20"
                  >
                    <span>Start {selectedNode.name} Test</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Modal Pop-up: Instantly visible right on screen upon clicking any skill node */}
      {isQuestionModalOpen && selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setIsQuestionModalOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-white shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7056ED]">
                    {selectedNode.categoryName || "Skill Assessment"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-[#7056ED] border border-purple-200">
                    <HelpCircle className="h-3 w-3" />
                    5 Questions
                  </span>
                </div>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {selectedNode.name}
                </h3>
              </div>

              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {questionsLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#7056ED] border-t-transparent" />
                  <p className="text-sm font-medium text-slate-500">
                    Loading 5 questions for <span className="font-semibold text-slate-700">{selectedNode.name}</span>...
                  </p>
                </div>
              )}

              {!questionsLoading && questionsError && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-6 text-center">
                  <AlertCircle className="mx-auto h-7 w-7 text-rose-500 mb-2" />
                  <p className="text-sm font-semibold text-rose-800">{questionsError}</p>
                  <button
                    onClick={() => {
                      setQuestionsLoading(true);
                      setQuestionsError(null);
                      fetchQuestionsBySkill(selectedNode)
                        .then((res) => {
                          setQuestions(res || []);
                          setQuestionsLoading(false);
                        })
                        .catch(() => {
                          setQuestionsError("Failed to fetch questions for this skill.");
                          setQuestionsLoading(false);
                        });
                    }}
                    className="mt-3 rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!questionsLoading && !questionsError && questions.length > 0 && (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-500 font-medium">
                    Review these 5 questions or click <b>Take a Quick Test</b> to launch the assessment.
                  </p>

                  {questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-purple-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-[#7056ED]">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800">
                              {q.text}
                            </p>
                            <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
                              {q.difficulty || "BEGINNER"}
                            </span>
                          </div>

                          {q.options && Object.keys(q.options).length > 0 && (
                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(q.options).map(([optKey, optText]) => (
                                <div
                                  key={optKey}
                                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-700"
                                >
                                  <span className="font-bold text-[#7056ED]">{optKey}.</span>
                                  <span className="truncate">{optText}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-800">5 Questions Available</p>
                <p className="text-[11px] text-slate-500">Click to start test flow for this skill.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="flex-1 sm:flex-initial rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsQuestionModalOpen(false);
                    handleTakeQuickTest(selectedNode);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-[#7056ED] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#5f44e2] cursor-pointer shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Take a Quick Test</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Skill Detail Panel */}
      {selectedNode && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7056ED]">
                Selected Skill Details
              </span>
              <h3 className="mt-1 text-2xl font-bold text-slate-800">
                {selectedNode.name}
              </h3>
            </div>

            <button
              onClick={() => {
                if (onStartAssessment) {
                  onStartAssessment();
                } else {
                  navigate("/assessment");
                }
              }}
              className="flex items-center gap-1.5 self-start rounded-full bg-[#7056ED] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5f44e2] cursor-pointer shadow-md shadow-purple-500/20"
            >
              <span>Take Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Category</span>
              <p className="mt-1 font-semibold text-slate-700">
                {selectedNode.categoryName || "General"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Status</span>
              <p className="mt-1 font-semibold text-slate-700">
                {selectedNode.status || "LOCKED"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Mastery Score</span>
              <p className="mt-1 font-semibold text-slate-700">
                {Math.round(Number(selectedNode.masteryScore ?? 0) * 100)}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Difficulty</span>
              <p className="mt-1 font-semibold text-slate-700">
                {selectedNode.difficultyLevel || "Unspecified"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Prerequisites</span>
              <p className="mt-1 text-sm text-slate-700">
                {prerequisiteNames.length ? prerequisiteNames.join(", ") : "None (Root Skill)"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Directly Unlocks</span>
              <p className="mt-1 text-sm text-slate-700">
                {unlockNames.length ? unlockNames.join(", ") : "None (Terminal Skill)"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
