export default (srv) => {
    srv.before("CREATE", "Incidents", (req) => {
        const data = req.data;

        if (!data) return;

        if (!data.status_ID) {
            data.status_ID = "OPEN";
        }

        if (!data.targetDate) {
            const targetDate = new Date();

            targetDate.setDate(
                targetDate.getDate() + 7
            );

            data.targetDate =
                targetDate.toISOString().split("T")[0];
        }

        if (data.urgency_ID === "CRITICAL") {
            data.status_ID = "ESCALATED";
        }
});


    srv.after("READ", "Incidents", (results) => {
        const items = Array.isArray(results)
            ? results
            : [results];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        items.forEach((item) => {
            if (!item?.targetDate) return;

            const target = new Date(item.targetDate);
            target.setHours(0, 0, 0, 0);

            const diffTime = target - today;

            const diffDays = Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            );

            item.daysToDeadline = diffDays;


            const status =item.status_ID ?? item.status?.ID;

            if (status === "CLOSED" || status === "RESOLVED") {
                item.slaStatus = "Completed";
                item.criticality = 3;
                item.daysToDeadline = null;
                return;
            }

            if (diffDays < 0) {
                item.slaStatus = "Overdue";
                item.criticality = 1;
                return;
            }

            if (diffDays <= 2) {
                item.slaStatus = "Due Soon";
                item.criticality = 2;
                return;
            } else {
                item.slaStatus = "On Track";
                item.criticality = 3;
            }            
        });
    });
};