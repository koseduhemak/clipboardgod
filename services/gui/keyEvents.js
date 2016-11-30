/**
 * Created by mfuesslin on 30.11.2016.
 */
let control = require('./Control');
function keyEvents() {

}

keyEvents.prototype.doKeyProcessing = function(e) {
    switch(e.which) {
        case 37: control.getPrevItem();// left
            break;

        case 39: control.getNextItem();// right
            break;

        case 13: control.updateClipboard();
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
}


module.exports = new keyEvents();