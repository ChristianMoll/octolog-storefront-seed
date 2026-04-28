export interface ApprovalRule {
  id: string;
  name: string;
  description?: string;
  requesters: Array<{ key: string; name: string }>;
  status: "active" | "inactive";
  // reason: rules/approvers use the rule-builder Group type which is component-internal
  rules: unknown[];
  approvers: unknown[];
}
