import {
  AIWorkflowRecommendation,
  AIOptimizationSuggestion,
  AINaturalLanguageRequest,
  AINaturalLanguageResponse,
  WorkflowDefinition,
  WorkflowExecution,
} from "./workflowTypes";

// ─── Provider-agnostic AI integration interfaces ─────────────────────────────
// Implement these interfaces with a concrete AI provider (OpenAI, Anthropic, etc.)
// without changing core workflow engine code.

export interface AIWorkflowProvider {
  /**
   * Suggest workflows based on platform activity patterns.
   */
  getRecommendations(
    context: AIRecommendationContext
  ): Promise<AIWorkflowRecommendation[]>;

  /**
   * Suggest optimizations for an existing workflow execution history.
   */
  getOptimizations(
    executions: WorkflowExecution[],
    workflow: WorkflowDefinition
  ): Promise<AIOptimizationSuggestion[]>;

  /**
   * Convert a natural-language description into a workflow definition.
   */
  parseNaturalLanguage(
    request: AINaturalLanguageRequest
  ): Promise<AINaturalLanguageResponse>;

  /**
   * Predict which users are likely to trigger a given workflow event.
   */
  predictTriggers(context: AIPredictionContext): Promise<AIPrediction[]>;
}

export interface AIRecommendationContext {
  recentEvents: string[];
  existingWorkflows: WorkflowDefinition[];
  memberCount: number;
  activeModules: string[];
}

export interface AIPredictionContext {
  triggerEvent: string;
  historicalData: Record<string, unknown>;
  lookaheadDays: number;
}

export interface AIPrediction {
  userId: string;
  likelihood: number;
  reasoning: string;
}

// ─── Stub implementation (no-op) ─────────────────────────────────────────────
// Replace with a real provider implementation when AI is enabled.

class NoOpAIWorkflowProvider implements AIWorkflowProvider {
  async getRecommendations(): Promise<AIWorkflowRecommendation[]> {
    return [];
  }

  async getOptimizations(): Promise<AIOptimizationSuggestion[]> {
    return [];
  }

  async parseNaturalLanguage(
    request: AINaturalLanguageRequest
  ): Promise<AINaturalLanguageResponse> {
    return {
      workflow: {
        name: "New Workflow",
        description: request.prompt,
        nodes: [],
        edges: [],
      },
      clarifications: [
        "AI workflow generation is not yet configured. Please build the workflow manually.",
      ],
    };
  }

  async predictTriggers(): Promise<AIPrediction[]> {
    return [];
  }
}

export const aiWorkflowProvider: AIWorkflowProvider = new NoOpAIWorkflowProvider();

// ─── Registry for swapping providers at runtime ───────────────────────────────

let _activeProvider: AIWorkflowProvider = new NoOpAIWorkflowProvider();

export function setAIWorkflowProvider(provider: AIWorkflowProvider): void {
  _activeProvider = provider;
}

export function getAIWorkflowProvider(): AIWorkflowProvider {
  return _activeProvider;
}
