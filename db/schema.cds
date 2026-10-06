namespace my.demo;

using { cuid, managed } from '@sap/cds/common';

entity Incidents : cuid, managed {
    title       : String(100) not null;
    description : String(500);

    status      : Association to Statuses;
    urgency     : Association to Urgencies;
    responsible : Association to Responsibles;

    targetDate  : Date;
    closedAt    : Timestamp;

    virtual daysToDeadline : Integer;
    virtual criticality    : Integer;
    virtual slaStatus      : String(30);
}
@cds.odata.valuelist
entity Statuses {
    key ID : String(20);
    name   : String(50);
}
@cds.odata.valuelist
entity Urgencies {
    key ID  : String(20);
    name    : String(50);
    slaDays : Integer;
}

@cds.odata.valuelist
entity Responsibles {
    key ID : String(20);
    name   : String(100);
    email  : String(150);
}