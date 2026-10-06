using my.demo from '../db/schema';

service IncidentsService @(requires: 'authenticated-user') {

    @(restrict: [
        { grant: ['READ'], to: ['support', 'admin'] },
        { grant: ['CREATE', 'UPDATE', 'DELETE'], to: ['admin'] }
    ])
    @odata.draft.enabled
    entity Incidents as projection on demo.Incidents;

    @readonly
    entity Responsibles as projection on demo.Responsibles;

    @readonly
    entity Statuses as projection on demo.Statuses;

    @readonly
    entity Urgencies as projection on demo.Urgencies;
}