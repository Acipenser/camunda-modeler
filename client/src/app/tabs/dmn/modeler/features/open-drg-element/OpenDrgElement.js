/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { getBBox } from 'diagram-js/lib/util/Elements';


export default class OpenDrgElement {
  constructor(canvas, elementRegistry, eventBus) {
    this._canvas = canvas;

    let openedElement;

    eventBus.on('import.done', () => {
      elementRegistry.forEach(element => {
        const { businessObject } = element;

        if (is(element, 'dmn:Decision') && businessObject.decisionLogic) {
          canvas.addMarker(element, 'can-open');
        }
      });

      if (openedElement) {
        const element = elementRegistry.get(openedElement);

        if (element) {
          canvas.addMarker(element, 'open');

          this.centerViewbox(element);
        }
      }
    });

    eventBus.on('drgElementOpened', ({ id }) => {
      openedElement = id;

      const element = elementRegistry.get(id);

      if (element && (is(element, 'dmn:Decision') || is(element, 'dmn:LiteralExpression'))) {
        elementRegistry.forEach(e => {
          canvas.removeMarker(e, 'open');
        });

        canvas.addMarker(element, 'open');

        this.centerViewbox(element);
      }
    });

    eventBus.on('element.click', ({ element }) => {
      const { id } = element;

      openedElement = id;

      eventBus.fire('openDrgElement', {
        id
      });

      // this.centerViewbox(element);
    });
  }

  centerViewbox = function(element) {
    var viewbox = this._canvas.viewbox();

    var box = getBBox(element);

    var newViewbox = {
      x: (box.x + box.width/2) - viewbox.outer.width/2,
      y: (box.y + box.height/2) - viewbox.outer.height/2,
      width: viewbox.outer.width,
      height: viewbox.outer.height
    };

    this._canvas.viewbox(newViewbox);

    this._canvas.zoom(viewbox.scale);
  }
}

OpenDrgElement.$inject = [ 'canvas', 'elementRegistry', 'eventBus' ];