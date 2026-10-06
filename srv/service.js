export default function () {

    const { Incidents, Urgencies } = this.entities;

    this.before("CREATE", Incidents, async (req) => {
        const data = req.data;

        if (!data.status_ID) {
            data.status_ID = "OPEN";
        }

        if (data.urgency_ID && !data.targetDate) {
            const urgency = await SELECT.one
                .from(Urgencies)
                .where({ ID: data.urgency_ID });

            if (urgency) {
                const targetDate = new Date();
                targetDate.setDate(
                    targetDate.getDate() + urgency.slaDays
                );

                data.targetDate =
                    targetDate.toISOString().split("T")[0];
            }
        }

        if (data.urgency_ID === "CRITICAL") {
            data.status_ID = "ESCALATED";
        }
    });


    this.before("UPDATE", Incidents, (req) => {
        if (req.data.urgency_ID === "CRITICAL") {
            req.data.status_ID = "ESCALATED";
        }
    });


    this.after("READ", Incidents, (results) => {
        const items = Array.isArray(results)
            ? results
            : [results];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const item of items) {
            if (!item?.targetDate) continue;

            const target = new Date(item.targetDate);
            target.setHours(0, 0, 0, 0);

            item.daysToDeadline = Math.ceil(
                (target - today) / (1000 * 60 * 60 * 24)
            );

            if (
                item.status_ID === "CLOSED" ||
                item.status_ID === "RESOLVED"
            ) {
                item.slaStatus = "Completed";
                item.criticality = 3;
            } else if (item.daysToDeadline < 0) {
                item.slaStatus = "Overdue";
                item.criticality = 1;
            } else if (item.daysToDeadline <= 2) {
                item.slaStatus = "Due Soon";
                item.criticality = 2;
            } else {
                item.slaStatus = "On Track";
                item.criticality = 3;
            }
        }
    });
}