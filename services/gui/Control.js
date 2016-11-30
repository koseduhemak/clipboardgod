/**
 * Created by mfuesslin on 30.11.2016.
 */
const clipboard = require('../clipboard/clipboard');
function Control() {
    this.currentLeft = 0;
}

Control.prototype.getPrevItem = function() {
    var activeItem = getActiveItem();
    var prevItem = activeItem.prev();

    if (prevItem.length > 0) {
        activeItem.removeClass("active");
        prevItem.addClass("active");

        if (this.currentLeft < 0) {
            this.currentLeft += prevItem.outerWidth(true);
            $('.clipboard-content-container').css("transform", "translateX("+this.currentLeft+"px)");
        }
    }
};

Control.prototype.getNextItem = function() {
    var activeItem = getActiveItem();
    var nextItem = activeItem.next();
    var screenWidth = $(window).width();
    var breakPoint = (($('.clipboard-item').length * activeItem.outerWidth(true)) - screenWidth) * (-1);


    if (nextItem.length > 0) {
        activeItem.removeClass("active");
        nextItem.addClass("active");

        console.log((($('.clipboard-item').length * activeItem.outerWidth(true)) - screenWidth) * (-1), this.currentLeft);
        if (breakPoint  < this.currentLeft) {
            this.currentLeft -= nextItem.outerWidth(true);
            $('.clipboard-content-container').css("transform", "translateX("+this.currentLeft+"px)");
        }
    }
};

Control.prototype.updateClipboard = function() {
    clipboard.writeToClipboard(getActiveItem().children('.clipboard-content'));
};


module.exports = new Control();
// HELPER

function getActiveItem() {
    return $('.clipboard-item.active');
}
