export const getCssCustomProperty = (property: string) => {
    const element = document.querySelector(':root');
    const computedStyle = window.getComputedStyle(element!);
    return computedStyle.getPropertyValue(property);
};

export const getCssCustomPropertyNumberValue = (property: string) => {
    // TODO account for rem etc
    const value = getCssCustomProperty(property).replace('px', '');
    return +value;
};
