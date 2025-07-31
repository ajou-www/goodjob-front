interface application {
    applicationId: number;
    jobId: number;
    jobTitle: string;
    companyName: string;
    applyDueDate: string | null;
    applyStatus: string;
    note: string | null;
    createdAt: string;
}

export default application;
