'use strict'

describe("StorageUpdater", function suite() {

    it("should make cross domain call to api endpoint", function test(done) {

        beforeEach(function(){
            jasmine.Ajax.install();
        })

        var TestResponses = {
            getPersonsOK: {
                success: {
                    status: 200,
                    responseText: JSON.stringify(MockFactory.set1.getPersons())
                }
            },
            getOrganizatinsOK: {
                success: {
                    status: 200,
                    responseText: JSON.stringify(MockFactory.set1.getOrganizations())
                }
            }
        };

        var CahootsStorage = require("app/extension/CahootsStorage")
        var storage = new CahootsStorage({});

        var xhr1 = new XMLHttpRequest();
        var xhr2 = new XMLHttpRequest();

        var StorageUpdater = require("app/extension/StorageUpdater");
        var updater = new StorageUpdater('https://api.cahoots.pw/v1');

        updater.update(xhr1, xhr2, storage, function(personValues,orgaValues){

            //console.log(typeof data)
            //expect(personValues.length).toBe(62)
            //expect(orgaValues.length).toBe(62)
            done()
        });
    })
})