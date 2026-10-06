sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"incidents/test/integration/pages/IncidentsList.gen",
	"incidents/test/integration/pages/IncidentsObjectPage.gen"
], function (JourneyRunner, IncidentsListGenerated, IncidentsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('incidents') + '/test/flpSandbox.html#incidents-tile',
        pages: {
			onTheIncidentsListGenerated: IncidentsListGenerated,
			onTheIncidentsObjectPageGenerated: IncidentsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

