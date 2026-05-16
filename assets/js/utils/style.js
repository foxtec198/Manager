const rootStyles = getComputedStyle(document.documentElement);

export const primary = rootStyles.getPropertyValue('--primary').trim();
export const secondary = rootStyles.getPropertyValue('--secondary').trim();
export const tertiary = rootStyles.getPropertyValue('--tertiary').trim();
export const foreground = rootStyles.getPropertyValue('--primary-foreground').trim();

export const blue = rootStyles.getPropertyValue('--blue').trim();
export const violet = rootStyles.getPropertyValue('--violet').trim();
export const orange = rootStyles.getPropertyValue('--orange').trim();
export const brow = rootStyles.getPropertyValue('--brow').trim();
export const dark_red = rootStyles.getPropertyValue('--dark_red').trim();
export const red = rootStyles.getPropertyValue('--red').trim();