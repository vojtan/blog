var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    DateUtils.isBankHoliday = function (d) {
        var dateWithoutTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return this.BankHolidays.filter(function (x) { return x.getTime() === dateWithoutTime; }).length >= 1;
    };
    DateUtils.getWeekNumber = function (d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
    };
    DateUtils.addHoursToDate = function (date, h) {
        var copiedDate = new Date(date.getTime());
        copiedDate.setTime(copiedDate.getTime() + (h * 60 * 60 * 1000));
        return copiedDate;
    };
    DateUtils.BankHolidays = [
        new Date(2019, 0, 1),
        new Date(2019, 3, 10),
        new Date(2019, 3, 13),
        new Date(2019, 4, 1),
        new Date(2019, 4, 8),
        new Date(2019, 6, 5),
        new Date(2019, 6, 6),
        new Date(2019, 8, 28),
        new Date(2019, 9, 28),
        new Date(2019, 10, 17),
        new Date(2019, 11, 24),
        new Date(2019, 11, 25),
        new Date(2019, 11, 26),
        new Date(2020, 0, 1),
        new Date(2020, 3, 10),
        new Date(2020, 3, 13),
        new Date(2020, 4, 1),
        new Date(2020, 4, 8),
        new Date(2020, 6, 5),
        new Date(2020, 6, 6),
        new Date(2020, 8, 28),
        new Date(2020, 9, 28),
        new Date(2020, 10, 17),
        new Date(2020, 11, 24),
        new Date(2020, 11, 25),
        new Date(2020, 11, 26),
    ];
    return DateUtils;
}());
var TimeInformation = /** @class */ (function () {
    function TimeInformation() {
        this.closesSoon = false;
        this.openingTime = null;
    }
    return TimeInformation;
}());
var WeekOccurrence;
(function (WeekOccurrence) {
    WeekOccurrence[WeekOccurrence["Odd"] = 0] = "Odd";
    WeekOccurrence[WeekOccurrence["Even"] = 1] = "Even";
    WeekOccurrence[WeekOccurrence["Every"] = 2] = "Every";
})(WeekOccurrence || (WeekOccurrence = {}));
var DayOccurrence;
(function (DayOccurrence) {
    DayOccurrence[DayOccurrence["Always"] = 0] = "Always";
    DayOccurrence[DayOccurrence["WorkDays"] = 1] = "WorkDays";
    DayOccurrence[DayOccurrence["Weekend"] = 2] = "Weekend";
    DayOccurrence[DayOccurrence["Saturday"] = 3] = "Saturday";
})(DayOccurrence || (DayOccurrence = {}));
var OpeningTime = /** @class */ (function () {
    function OpeningTime() {
        this.name = "";
        this.from = 0;
        this.to = 0;
        this.url = '';
        this.map = '';
    }
    OpeningTime.prototype.doesCloseSoon = function (date) {
        var diffInHours = this.to - date.getHours() - date.getMinutes() / 60;
        return diffInHours < 1 && diffInHours > 0;
    };
    return OpeningTime;
}());
var OpeningTimeDateRange = /** @class */ (function (_super) {
    __extends(OpeningTimeDateRange, _super);
    function OpeningTimeDateRange(init) {
        var _this = _super.call(this) || this;
        _this.startDate = new Date();
        _this.endDate = new Date();
        Object.assign(_this, init);
        return _this;
    }
    OpeningTimeDateRange.prototype.getNextOpenTime = function (date) {
        return new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), Math.floor(this.from), 60 * (this.from - Math.floor(this.from)), 0);
    };
    OpeningTimeDateRange.prototype.isOpen = function (date) {
        var dateWithoutHours = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        if ((dateWithoutHours >= new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()).getTime()) &&
            (dateWithoutHours <= new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()).getTime())) {
            var time = date.getHours() + date.getMinutes() / 60;
            return (this.from <= time && this.to >= time);
        }
        return false;
    };
    return OpeningTimeDateRange;
}(OpeningTime));
var OpeningTimeWeekly = /** @class */ (function (_super) {
    __extends(OpeningTimeWeekly, _super);
    function OpeningTimeWeekly(init) {
        var _this = _super.call(this) || this;
        _this.weekOccurrence = WeekOccurrence.Every;
        _this.dayOccurence = DayOccurrence.Always;
        Object.assign(_this, init);
        return _this;
    }
    OpeningTimeWeekly.prototype.isCorrectDay = function (date) {
        var dayNumber = date.getDay();
        switch (this.dayOccurence) {
            case DayOccurrence.Weekend:
                return dayNumber === 0 || dayNumber === 6; // 0 = Sunday // 6 = Saturday
            case DayOccurrence.WorkDays:
                return !(dayNumber === 0 || dayNumber === 6);
            case DayOccurrence.Saturday:
                return dayNumber === 6;
        }
        return true;
    };
    OpeningTimeWeekly.prototype.isInCorrectWeek = function (date) {
        switch (this.weekOccurrence) {
            case WeekOccurrence.Even:
                return (DateUtils.getWeekNumber(date) % 2 === 0);
            case WeekOccurrence.Odd:
                return DateUtils.getWeekNumber(date) % 2 === 1;
        }
        return true;
    };
    OpeningTimeWeekly.prototype.isOpenOnThisDay = function (date) {
        if (!this.isInCorrectWeek(date)) {
            return false;
        }
        if (DateUtils.isBankHoliday(date)) {
            return false;
        }
        if (!this.isCorrectDay(date)) {
            return false;
        }
        return true;
    };
    OpeningTimeWeekly.prototype.isOpen = function (date) {
        if (!this.isOpenOnThisDay(date))
            return false;
        var time = date.getHours() + date.getMinutes() / 60;
        return (this.from <= time && this.to >= time);
    };
    OpeningTimeWeekly.prototype.getNextOpenTime = function (date) {
        for (var i = 0; i < 50; i++) {
            var testedDate = new Date(date);
            testedDate.setDate(testedDate.getDate() + i);
            if (this.isOpenOnThisDay(testedDate)) {
                var nextOpenTime = new Date(testedDate.getFullYear(), testedDate.getMonth(), testedDate.getDate(), Math.floor(this.from), 60 * (this.from - Math.floor(this.from)), 0);
                if (nextOpenTime > date)
                    return nextOpenTime;
            }
        }
        throw "Cannot calculate next opening time";
    };
    return OpeningTimeWeekly;
}(OpeningTime));
var OpeningHoursService = /** @class */ (function () {
    function OpeningHoursService() {
        this.defaultOpeningTimes = [
            new OpeningTimeWeekly({ name: "Sběrný dvůr Březová", from: 8, to: 13.5, map: "https://www.google.com/maps/search/?api=1&query=50.771072,14.221335", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/93-sberny-dvur-brezova.shtml", weekOccurrence: WeekOccurrence.Even, dayOccurence: DayOccurrence.WorkDays }),
            new OpeningTimeWeekly({ name: "Sběrný dvůr Březová", from: 12, to: 18, map: "https://www.google.com/maps/search/?api=1&query=50.771072,14.221335", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/93-sberny-dvur-brezova.shtml", weekOccurrence: WeekOccurrence.Odd, dayOccurence: DayOccurrence.WorkDays }),
            new OpeningTimeWeekly({ name: "Sběrný dvůr Březová", from: 8, to: 14, map: "https://www.google.com/maps/search/?api=1&query=50.771072,14.221335", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/93-sberny-dvur-brezova.shtml", weekOccurrence: WeekOccurrence.Odd, dayOccurence: DayOccurrence.Saturday }),
            new OpeningTimeWeekly({ name: "Sběrný dvůr Pískovna", from: 8, to: 13.5, map: "https://www.google.com/maps/search/?api=1&query=50.776045,14.188368", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/94-sberny-dvur-piskovna.shtml", weekOccurrence: WeekOccurrence.Odd, dayOccurence: DayOccurrence.WorkDays }),
            new OpeningTimeWeekly({ name: "Sběrný dvůr Pískovna", from: 12, to: 18, map: "https://www.google.com/maps/search/?api=1&query=50.776045,14.188368", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/94-sberny-dvur-piskovna.shtml", weekOccurrence: WeekOccurrence.Even, dayOccurence: DayOccurrence.WorkDays }),
            new OpeningTimeWeekly({ name: "Sběrný dvůr Pískovna", from: 8, to: 14, map: "https://www.google.com/maps/search/?api=1&query=50.776045,14.188368", url: "https://www.mariuspedersen.cz/cs/sluzby-ve-vasem-meste/technicke-sluzby-decin-a-s/provozovny-k-dispozici/94-sberny-dvur-piskovna.shtml", weekOccurrence: WeekOccurrence.Even, dayOccurence: DayOccurrence.Saturday }),
        ];
    }
    OpeningHoursService.prototype.getFacilityThatOpensSoon = function (date) {
        return this.openingTimes.map(function (x) { return { openingTime: x, nextOpenTime: x.getNextOpenTime(date) }; }).sort(function (a, b) { return a.nextOpenTime.getTime() - b.nextOpenTime.getTime(); })[0];
    };
    OpeningHoursService.prototype.getOpenFacilities = function (date) {
        var result = this.openingTimes.filter(function (item) { return item.isOpen(date); });
        return result.map(function (x) {
            return {
                openingTime: x,
                closesSoon: x.doesCloseSoon(date)
            };
        });
    };
    OpeningHoursService.prototype.getFormattedTime = function (timeInHours) {
        var timeInMinutes = timeInHours * 60;
        var hours = Math.floor(timeInMinutes / 60).toString().padStart(2, "0");
        var minutes = (timeInMinutes % 60).toString().padStart(2, "0");
        return hours + ":" + minutes;
    };
    OpeningHoursService.prototype.getTooltip = function (facility) {
        return this.getFormattedTime(facility.from) + "-" + this.getFormattedTime(facility.to);
    };
    OpeningHoursService.prototype.getHtmlForFacilityThatOpenSoon = function (facilityThatOpensSoon) {
        var viewModel = {};
        viewModel.name = facilityThatOpensSoon.openingTime.name;
        viewModel.nextOpenTimeFormatted = moment(facilityThatOpensSoon.nextOpenTime).format("LT");
        viewModel.nextOpenDateFormatted = moment(facilityThatOpensSoon.nextOpenTime).format("DD.MM.");
        viewModel.tooltip = this.getTooltip(facilityThatOpensSoon.openingTime);
        viewModel.url = facilityThatOpensSoon.openingTime.url;
        viewModel.map = facilityThatOpensSoon.openingTime.map;
        var tmpl = "<div class='card opening-soon'>\n    <div class='card-body'>\n        <h5 class='card-title'>\n            {{name}} uzav\u0159en\n        </h5>\n        <div  class='card-text'>                    \n            otev\u0159e {{nextOpenDateFormatted}} v {{nextOpenTimeFormatted}}</span>\n        </div>\n        <div class=\"row card-info\">\n            <div class=\"col-sm-6\">\n                <a target='_blank'  class=\"card-link\" href=\"{{url}}\">V\u00EDce informac\u00ED</a>\n            </div>\n            <div class=\"col-sm-6\">\n                <a target='_blank' class=\"card-link\" href=\"{{map}}\">Zobrazit mapu</a>\n            </div>                               \n        </div>   \n     </div>\n</div>\n";
        return Mustache.to_html(tmpl, viewModel);
    };
    OpeningHoursService.prototype.getHtmlForOpenFacilities = function (openFacilities) {
        var _this = this;
        return openFacilities.map(function (openFacility) {
            var closingTag = "";
            if (openFacility.closesSoon) {
                closingTag = ", ale brzy zavírá";
            }
            var viewModel = {
                name: openFacility.openingTime.name,
                closingTag: closingTag,
                openingHours: _this.getTooltip(openFacility.openingTime),
                url: openFacility.openingTime.url,
                map: openFacility.openingTime.map
            };
            var tmpl = "<div class='card open'>\n                            <div class='card-body'>\n                                <h5 class='card-title'>\n                                    {{name}} otev\u0159en{{closingTag}}\n                                </h5>\n                                <div  class='card-text'> Otev\u00EDrac\u00ED doba {{openingHours}}\n                                </div>\n                                <div class=\"row card-info\">\n                                    <div class=\"col-sm-6\">\n                                        <a target='_blank'  class=\"card-link\" href=\"{{url}}\">V\u00EDce informac\u00ED</a>\n                                    </div>\n                                    <div class=\"col-sm-6\">\n                                        <a target='_blank' class=\"card-link\" href=\"{{map}}\">Zobrazit mapu</a>\n                                    </div>                               \n                                </div>   \n                             </div>\n                        </div>\n                        ";
            return Mustache.to_html(tmpl, viewModel);
        }).join();
    };
    OpeningHoursService.prototype.renderHtml = function (openingTimes) {
        if (!openingTimes)
            this.openingTimes = this.defaultOpeningTimes;
        var date = new Date();
        var openFacilities = this.getOpenFacilities(date);
        var result = this.getHtmlForOpenFacilities(openFacilities);
        var facilityThatOpensSoon = this.getFacilityThatOpensSoon(date);
        if (openFacilities.length == 0 || DateUtils.addHoursToDate(facilityThatOpensSoon.nextOpenTime, -3) > date)
            result += this.getHtmlForFacilityThatOpenSoon(facilityThatOpensSoon);
        return result;
    };
    return OpeningHoursService;
}());
