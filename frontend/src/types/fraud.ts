export type FraudAlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

export type FraudAlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type FraudAlert = {
    id: string;
    transactionId: string;
    customerId: string;
    title: string;
    description: string;
    severity: FraudAlertSeverity;
    status: FraudAlertStatus;
    riskScore: number;
    fraudProbability: number;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
    resolvedAt?: string;
    resolution?: string;
    falsePositiveReason?: string;
    relatedAlerts?: string[];
    triggers: string[];
    metadata?: Record<string, any>;
};

export type FraudRule = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    conditions: FraudRuleCondition[];
    actions: FraudRuleAction[];
    priority: number;
    createdAt: string;
    updatedAt: string;
    triggeredCount: number;
    falsePositiveRate: number;
};

export type FraudRuleCondition = {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
    value: any;
};

export type FraudRuleAction = {
    type: 'flag' | 'block' | 'alert' | 'review';
    severity: FraudAlertSeverity;
    message?: string;
};

export type InvestigationCase = {
    id: string;
    alertId: string;
    investigatorId: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    findings: string;
    evidence: InvestigationEvidence[];
    createdAt: string;
    closedAt?: string;
};

export type InvestigationEvidence = {
    type: 'document' | 'screenshot' | 'log' | 'note';
    content: string;
    attachmentUrl?: string;
    addedAt: string;
    addedBy: string;
};

export type CreateFraudRuleInput = {
    name: string;
    description: string;
    conditions: Omit<FraudRuleCondition, 'id'>[];
    actions: Omit<FraudRuleAction, 'id'>[];
    priority: number;
    isActive?: boolean;
};

export type UpdateFraudRuleInput = Partial<CreateFraudRuleInput>;
