/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

export default class OpenDrgElement {
  constructor(eventBus, _parent) {
    const button = document.createElement('button');

    button.classList.add('edit-drd');

    button.textContent = 'Edit DRD';

    button.addEventListener('click', () => {
      eventBus.fire('editDrd');
    });

    _parent._container.appendChild(button);
  }
}

OpenDrgElement.$inject = [
  'eventBus',
  '_parent'
];