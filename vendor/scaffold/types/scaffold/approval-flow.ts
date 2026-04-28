import type { ApprovalRule } from "./approval-rule";
import type { Order } from "./order";

export type ApprovalFlowStatus = "pending" | "accepted" | "rejected";

interface ApproverRef {
  key: string;
  name?: string;
  roles?: Array<{ key: string; name: string }>;
}

export interface ApprovalFlow {
  id: string;
  date: string;
  status: ApprovalFlowStatus;
  businessUnit: { key: string };
  rules: ApprovalRule[];
  order: Order;
  approvals: Array<{
    approvedAt: string;
    approver: ApproverRef;
  }>;
  rejection?: {
    rejectedAt: string;
    reason: string;
    rejecter: ApproverRef;
  };
  eligibleApprovers: ApproverRef[];
  pendingApprovers: ApproverRef[];
  currentPendingApproverTiers: ApproverRef[];
}
