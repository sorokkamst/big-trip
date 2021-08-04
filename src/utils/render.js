export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const element = document.createElement(`div`);

  element.innerHTML = template;

  return element.firstElementChild;
};

export const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const renderComponent = (container, component, position = RenderPosition.BEFOREEND) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.parentNode.insertBefore(component.getElement(), container.nextSibling);
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

export const replaceComponent = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
