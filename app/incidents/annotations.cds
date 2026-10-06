using IncidentsService as service from '../../srv/service';

annotate service.Incidents with {
    title           @title : 'Incident';
    description     @title : 'Description';
    status          @title : 'Status';
    urgency         @title : 'Urgency';
    responsible     @title : 'Assigned To';
    targetDate      @title : 'Target Date';
    daysToDeadline  @title : 'Days Remaining';
    slaStatus       @title : 'SLA Status';
};

annotate service.Incidents with {
    status  @Common.ValueListWithFixedValues : true;
    urgency @Common.ValueListWithFixedValues : true;
    responsible @Common.ValueListWithFixedValues : true;
};


annotate service.Incidents with @(

    UI.HeaderInfo : {
        TypeName       : 'Incident',
        TypeNamePlural : 'Incidents',
        Title          : { Value : title },
        Description    : { Value : description }
    },

    UI.SelectionFields : [
        status.name,
        urgency_ID,
        responsible_ID,
        targetDate
    ],

UI.LineItem : [
    {
        Value : title,
        Label : 'Incident'
    },
    {
        Value : status.name,
        Label : 'Status'
    },
    {
        Value : urgency.name,
        Label : 'Urgency'
    },
    {
        Value : responsible_ID,
        Label : 'Assigned To'
    },
    {
        Value : slaStatus,
        Label : 'SLA Status',
        Criticality : criticality
    },
    {
        Value : daysToDeadline,
        Label : 'Days Remaining',
        Criticality : criticality
    },
    {
        Value : targetDate,
        Label : 'Target Date'
    }
],
    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#General'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'SLA',
            Target : '@UI.FieldGroup#SLA'
        }
    ],

    UI.FieldGroup#General : {
        Data : [
            { Value : title },
            { Value : description },
            { Value : status_ID },
            { Value : urgency_ID },
            { Value : responsible_ID }
        ]
    },

    UI.FieldGroup#SLA : {
        Data : [
            { Value : targetDate },
            {
                Value : daysToDeadline,
                Criticality : criticality
            },
            {
                Value : slaStatus,
                Criticality : criticality
            }
        ]
    }
);