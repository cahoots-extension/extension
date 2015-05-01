/**
 * cahoots extension
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */
(function () {
    'use strict';

    function CahootsRunner(handleFullDetails, handleAuthorHints, uiFormatter, contentConfig) {
        if (arguments.length !== 4) {
            throw new Error('CahootsRunner() needs exactly 4 arguments');
        }
        this.handleAuthorHints = handleAuthorHints;
        this.handleFullDetails = handleFullDetails;
        this.uiFormatter = uiFormatter;
        this.config = contentConfig;
    }

    CahootsRunner.prototype.debug = function (debugMsg) {
        if (this.config.debug === true) {
            console.log(debugMsg);
        }
    };

    CahootsRunner.prototype.findMatchingKeys = function (authorHints) {
        var foundKeys = [];
        for (var key in authorHints) {
            if (jQuery('form:contains("' + key + '")').length > 0) {
                break;
            }
            if (jQuery('body:contains("' + key + '")').length <= 0) {
                continue;
            }
            foundKeys.push(key);
        }
        return foundKeys;
    }


    CahootsRunner.prototype.highlightGivenKeys = function (foundKeys, authorHints) {
        jQuery("body").highlight(foundKeys, {caseSensitive: false, className: authorHints});
    }


    CahootsRunner.prototype.tooltipsterize = function () {
        var that = this;

        jQuery('span[class*=CahootsID]').tooltipster({
            contentAsHTML: false,
            content: jQuery('<span/>').text(that.config.snippets.loading_text),
            interactive: that.config.tooltip.interactive,
            animation: that.config.tooltip.animation,
            delay: that.config.tooltip.delay,
            speed: that.config.tooltip.speed,
            timer: that.config.tooltip.timer,
            autoClose: that.config.tooltip.autoClose,
            functionBefore: function (origin, continueTooltip) {

                var tooltipElement = this;
                continueTooltip();
                var id = jQuery(this).attr('class').replace(' tooltipstered', '');
                var strippedId = id.split("_")[1];

                that.handleFullDetails(strippedId, function (data) {
                    var fullCahootsOverlayContent = that.uiFormatter.createDetailsView(tooltipElement, data);
                    origin.tooltipster('content', fullCahootsOverlayContent);
                })
            }
        });
    }

    CahootsRunner.prototype.run = function () {
        var debug = this.debug;
        if(debug) { console.log("CahootsRunner.run()")}

        var that = this;
        this.handleAuthorHints(function (authorHints) {
            var foundKeys = that.findMatchingKeys(authorHints);
            if (debug) console.log('found keys: ' + foundKeys.length);
            that.highlightGivenKeys(foundKeys, authorHints);
            that.tooltipsterize();
            if (debug) console.log('finished script cycle');
        });
    };

    module.exports = CahootsRunner;
}());