'use strict';

module.exports = PetriNet;
function PetriNet(config) {
    let net = {};

    let _places = {};
    let _transitions = {};
    let _arcs = {};

    net.getNet = getNet;
    net.addPlace = addPlace;
    net.addTransition = addTransition;
    net.addArc = addArc;

    _init();

    return net;

    ///// Functions /////
    function _init() {
        if (config) _setInitialNet();
    }

    function _setInitialNet() {
        if (config.places) {
            for (let placeId in config.places) {
                net.addPlace(placeId, config.places[placeId]);
            }
        }
        if (config.transitions) {
            config.transitions.forEach(
                (transitionId) => net.addTransition(transitionId)
            );
        }
        if (config.arcs) {
            config.arcs.forEach(
                (arcId) => {
                    arcId = arcId.split('-');
                    let sourceId = arcId[0];
                    let targetId = arcId[1];
                    net.addArc(sourceId, targetId)
                }
            );
        }
    }

    function getNet() {
        return {
            places: _places,
            transitions: _transitions,
            arcs: _arcs
        };
    }

    function addPlace(id, tokens = 0) {
        if( _isUniqueId(id) ) {
            _places[id] = {
                tokens: tokens
            };
        } else {
            throw 'ERROR on adding place: duplicated "' + id + '" id';
        }
    }

    function addTransition(id) {
        if( _isUniqueId(id) ) {
            _transitions[id] = {};
        } else {
            throw 'ERROR on adding transition: duplicated "' + id + '" id';
        }
    }

    function _isUniqueId(id) {
        return !_places[id] && !_transitions[id] && !_arcs[id];
    }

    function addArc(sourceId, targetId, value) {
        let source = _getElement(sourceId);
        let target = _getElement(targetId);

        // Verify if source and place exist
        let bothExist = !!source && !!target;
        if ( !bothExist ) throw 'ERROR on adding arc: "' + (!source?sourceId:targetId) + '" doesn\'t exist';

        // Verify if is a valid arc
        let place2Transition = source.tokens !== undefined && target.tokens === undefined; // True if source is a place and target isn't
        let transition2Place = source.tokens === undefined && target.tokens !== undefined; // True if target is a place and source isn't
        if(!place2Transition && !transition2Place) throw 'ERROR on adding arc: source and target element must be of different type';

        // Verify if arc already exist
        let id = sourceId + '-' + targetId;
        if ( !_isUniqueId(id) ) throw 'ERROR on adding arc: duplicated "' + id + '" arc';

        // Add the new arc to JSON
        _arcs[id] = {
            source: sourceId,
            target: targetId,
            value: value || 1
        }
    }

    function _getElement(id) {
        return _places[id] || _transitions[id] || _arcs[id];
    }
}
